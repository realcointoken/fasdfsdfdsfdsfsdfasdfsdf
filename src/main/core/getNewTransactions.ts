import dotenv from "dotenv";
import { NETWORK, ethereumEvent, avalancheEvent } from "../../utils/interface";
import Ethereum from "../../helpers/ethereum";
import Avalanche from "../../helpers/avalanche";
import getCompletedSwaps from "./getCompletedSwaps";
dotenv.config();

const ethereum = new Ethereum();
const avalanche = new Avalanche();

const getNewTransactions = async (
  fromAddress: string,
  fromNetwork: string,
  depositAddress: string,
  block_height: number,
) => {
  const completedSwap = await getCompletedSwaps(fromAddress);

  if (completedSwap) {
    let swapArray: string[] = [];
    for (let swap of completedSwap) {
      swapArray.push(swap.unnest);
    }

    if (fromNetwork === NETWORK.ethereum) {
      let ethTransactions: any = await ethereum.getDepositTransactions(
        depositAddress,
        block_height,
      );

      const newTransactions = ethTransactions.filter(
        (transaction: ethereumEvent) => {
          if (!transaction || transaction.amount <= 0) {
            return false;
          }
          if (
            transaction.from === fromAddress &&
            transaction.to === depositAddress
          ) {
            return !swapArray.includes(transaction.transactionHash);
          }
          return;
        },
      );

      return newTransactions;
    }

    if (fromNetwork === NETWORK.avax) {
      let userTxs = await avalanche.filterUserTransactions(fromAddress);

      if (userTxs !== null) {
        const newTransactions = userTxs.filter(
          (avaTransaction: avalancheEvent) => {
            return !swapArray.includes(avaTransaction.id);
          },
        );
        console.log(newTransactions);
        return newTransactions;
      } else {
        console.log("user transactions is null");
      }
    }
  }
};

export default getNewTransactions;
