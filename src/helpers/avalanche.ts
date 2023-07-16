import dotenv from "dotenv";
import avaRpc from "../config/avaRpc";
import avaWallet from "./avaWallet";
import { avalancheEvent } from "../utils/interface";
import BaseChainClass from "../utils/chainInterface";

dotenv.config();

const creds = avaRpc.getUserCreds();

const { username, password } = creds;
const { TRYB_ASSET_ID, DEPOSIT_AVA_ADDRESS, DECIMALS } = process.env;

class Avalanche extends BaseChainClass {
  setWallet = async () => {
    const avaAallet = await avaWallet.createWalletFromprivKey();
    this.wallet = avaAallet;
  };
  constructor() {
    super();
    this.setWallet();
  }

  transfer = async (to: string, amount: number) => {
    console.log("wallet: --> ", this.wallet);
    try {
      let sendAmount = amount.toString();

      const adminWalletBalance:
        | number
        | null = await this.getAdminWalletBalance(this.wallet.address);

      console.log("Admin Balance: >> ", adminWalletBalance);

      if (adminWalletBalance && adminWalletBalance >= Number(sendAmount)) {
        console.log(`Sending ${sendAmount} TRYB to ${to}`);

        let response = await avaRpc.call("ext/bc/X", "avm.send", {
          username: username,
          password: password,
          assetID: TRYB_ASSET_ID,
          amount: sendAmount,
          to: to,
          from: [this.wallet.address],
        });

        if (response.error == undefined) {
          return response.result;
        } else {
          console.error(response.error.message);

          return null;
        }
      }
    } catch (err) {
      console.error(err);
      throw new Error("avalanche transfer failed");
    }
  };

  getDepositTransactions = async <T>(
    depositAddress: string,
  ): Promise<T[] | null> => {
    try {
      let res = await avaRpc.get(`v2/transactions?address=${depositAddress}`);
      //console.log(res.transactions);
      let txs: T[] = res.transactions!;
      if (txs != null) {
        //console.log(txs.length);
        return txs;
      } else {
        return null;
      }
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  };
  filterUserTransactions = async (userAddress: string) => {
    const user = userAddress.split("-")[1];

    const depositTransactions: any = await this.getDepositTransactions(
      DEPOSIT_AVA_ADDRESS!,
    );

    if (depositTransactions != null) {
      let userTx: avalancheEvent[] = [];
      for (let transaction of depositTransactions) {
        if (
          transaction.inputs != null &&
          transaction.inputs[0].credentials[0].address === user &&
          transaction.inputs[1].credentials[0].address === user
        ) {
          userTx.push(transaction);
        }
      }
      return userTx;
    } else {
      console.log("Not found deposit transaction");
      return null;
    }
  };

  calculateSendAmount = (transactions: any) => {
    let depositAddress = DEPOSIT_AVA_ADDRESS!.split("-")[1];

    let amount = 0;
    for (let tx of transactions) {
      for (let output of tx.outputs) {
        if (output.addresses[0] === depositAddress) {
          amount += Number(output.amount);
        }
      }
    }
    return amount;
  };

  getAdminWalletBalance = async (address: string) => {
    try {
      let response = await avaRpc.call("ext/bc/X", "avm.getBalance", {
        address: address,
        assetID: TRYB_ASSET_ID,
      });

      if (response.result.balance != undefined) {
        const balance: number = Number(response.result.balance);

        return balance;
      } else {
        return null;
      }
    } catch (err) {
      console.error(err);
      throw new Error("avalanche transfer failed");
    }
  };
}

export default Avalanche;
