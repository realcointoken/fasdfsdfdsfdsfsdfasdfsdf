import { Request, Response } from "express";
import getDepositAddress from "./core/getDepositAddress";
import getDepositHashs from "./core/getDepositHashes";
import getNewTransactions from "./core/getNewTransactions";
import calculateSendAmount from "./core/calculateSendAmount";
import processSwap from "./core/processSwap";
import updateSwapDetails from "./db/updateSwapDetails";
import insertSwap from "./db/insertSwap";
import getSwaps from "./db/getSwaps";
import getSwapById from "./db/getSwapById";
import validateCreateSwap from "./utils/validateCreateSwap";
import validateFinalizeSwap from "./utils/validateFinalizeSwap";
import getBlockHeight from "./core/getBlockHeight";
import {
  newSwapInterface,
  STATUS,
  recordInterface,
  swapInterface,
} from "../utils/interface";

import dotenv from "dotenv";
dotenv.config();

class Models {
  /********************************************************************************************************/
  /* CREATE SWAP
  /********************************************************************************************************/
  createSwap = async (req: Request, res: Response) => {
    const { toAddress, fromAddress, fromNetwork, toNetwork } = req.body;
    let isValid = validateCreateSwap(fromNetwork, toNetwork, toAddress);

    if (isValid) {
      let swaps = (await getSwaps(fromAddress)) as recordInterface[];

      const createdSwaps = swaps.filter((swap) => {
        if (
          swap.fromaddress === fromAddress &&
          swap.status === STATUS.pending
        ) {
          return true;
        } else return false;
      });

      console.log("createdSwaps --> ", createdSwaps);
      if (createdSwaps.length !== 0) {
        res.status(400).send({
          msg: "there is already a pending swap",
          uuid: createdSwaps[0].uuid,
          depositAddress: createdSwaps[0].depositaddress,
          from: createdSwaps[0].fromaddress,
          to: createdSwaps[0].toaddress,
        });
      } else {
        let depositAddress = getDepositAddress(
          fromNetwork,
          toNetwork,
        ) as string;
        console.log(depositAddress);

        const block_height = await getBlockHeight(fromNetwork);
        console.log(`Current block height is ${block_height}`);

        let swap: swapInterface = {
          fromAddress: fromAddress,
          toAddress: toAddress,
          fromNetwork: fromNetwork,
          toNetwork: toNetwork,
          depositAddress: depositAddress!,
          block_height: block_height!,
        };
        try {
          let newSwap = await insertSwap(swap);
          console.log("New Swap: ", newSwap);
          if (newSwap === null) {
            res.status(400).send({ msg: "swap is not created" });
          }
          res.json({
            uuid: newSwap.uuid,
            depositAddress: newSwap.depositaddress,
            from: newSwap.fromaddress,
            to: newSwap.toaddress,
          });
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  /********************************************************************************************************/
  /* FINALIZE SWAP
  /********************************************************************************************************/
  finalizeSwap = async (req: Request, res: Response) => {
    const { uuid } = req.body;

    let swap: recordInterface[] | undefined = await getSwapById(uuid);

    if (swap!.length === 0) {
      res.status(400).send({ msg: "Unable to find pending swap" });
    } else {
      console.log("Pending Swap: --> ", swap);
      console.log(
        "******************************************************************",
      );

      const isValid: boolean = validateFinalizeSwap(uuid);

      if (!isValid) {
        res.status(400).send({ msg: isValid });
      } else {
        const {
          uuid,
          fromaddress,
          toaddress,
          fromnetwork,
          tonetwork,
          depositaddress,
          block_height,
        }: recordInterface = swap![0];

        const newTransactions = await getNewTransactions(
          fromaddress,
          fromnetwork,
          depositaddress,
          block_height,
        );

        if (newTransactions!.length === 0) {
          res.status(400).json({ msg: "no avaliable transfer" });
        } else {
          console.log("NEW TRANSACTION: ", newTransactions);

          let depositTxHash = getDepositHashs(
            newTransactions,
            fromnetwork,
          ) as string[];

          let sendAmount = calculateSendAmount(
            newTransactions,
            fromnetwork,
            tonetwork,
          ) as number;

          console.log("Send Amount: --> ", sendAmount!.toFixed(0));

          const newSwap: newSwapInterface = {
            uuid: uuid,
            to: toaddress,
            amount: sendAmount,
            depositHashes: depositTxHash,
          };

          let txID = await processSwap(newSwap, fromnetwork, tonetwork);

          if (txID == null) {
            res.status(400).send({ msg: "transfer is failed" });
          } else {
            await updateSwapDetails(newSwap);

            console.log("txID --> ", txID);

            res.send({ txID: txID });
          }
        }
      }
    }
  };
}

export default Models;
