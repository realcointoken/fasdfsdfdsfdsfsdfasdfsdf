import ethWallet from "./ethWallet";
import dotenv from "dotenv";
import { ERC20ABI } from "../config/ERC20ABI";
import Web3 from "web3";
import fetch from "node-fetch";
import BaseChainClass from "../utils/chainInterface";
dotenv.config();

const {
  INFURAKEY_RINKEBY,
  ETHEREUM_TRYB_ADDRESS,
  DECIMALS,
  GASSTATIONAPIKEY,
  PRIVATEKEY,
  ETH_NETWORK,
} = process.env;

class Ethereum extends BaseChainClass {
  web3: Web3;

  setWallet = async () => {
    const etherWallet = new ethWallet(ETH_NETWORK!);
    this.wallet = etherWallet;
  };
  constructor() {
    super();
    this.web3 = new Web3(new Web3.providers.HttpProvider(INFURAKEY_RINKEBY!));
    this.setWallet();
  }

  getContract = () => {
    const tokenContract = new this.web3.eth.Contract(
      ERC20ABI,
      ETHEREUM_TRYB_ADDRESS,
    );
    return tokenContract;
  };

  getBlockHeight = async () => {
    const latest = await this.web3.eth.getBlockNumber();
    console.log(latest);
    return latest;
  };

  getDepositTransactions = async <T>(
    depositAddress: string,
    block_height: number,
  ): Promise<T[]> => {
    let contract = this.getContract();

    try {
      let transfers = await contract.getPastEvents("Transfer", {
        fromBlock: block_height,
        toBlock: "latest",
        filter: { to: depositAddress },
      });

      let events: T[] = transfers.map((transfer): any => {
        return {
          from: transfer.returnValues.from,
          to: transfer.returnValues.to,
          amount: parseFloat(
            this.web3.utils.fromWei(transfer.returnValues.value, "ether"),
          ),
          transactionHash: transfer.transactionHash,
        };
      });
      return events;
    } catch (err) {
      throw new Error(err);
    }
  };

  transfer = async (to: string, amount: number) => {
    const tokenContract: any = this.getContract();
    const sendAmount = amount * 10 ** Number(DECIMALS);

    const adminBalance = await this.checkAdminWalletBalance(
      this.wallet.wallet.address,
    );
    console.log("Admin Balance: >> ", adminBalance);

    if (adminBalance >= amount) {
      const data = tokenContract.methods.transfer(to, sendAmount).encodeABI();
      const gas = await this.getGasPrices();
      const nonce = await this.web3.eth.getTransactionCount(
        this.wallet.wallet.address,
        "pending",
      );

      const tx = {
        wallet: this.wallet,
        to: tokenContract._address,
        value: "0",
        gasPrice: this.web3.utils.toWei(gas.safeLow.toString(), "gwei"),
        nonce: nonce,
        data: data,
        gas: 300000,
      };

      try {
        const signed = await this.web3.eth.accounts.signTransaction(
          tx,
          PRIVATEKEY!,
        );

        const rawTx = signed.rawTransaction;

        const result = await this.web3.eth.sendSignedTransaction(
          rawTx!,
          (_, hash) => {
            console.log("hash: ", hash);
          },
        );

        return result;
      } catch (err) {
        console.error(err);
        throw new Error("ethereum transfer failed");
      }
    } else {
      throw new Error("Admin Wallet Balance is not enough");
    }
  };

  checkAdminWalletBalance = async (address: string) => {
    const contract = this.getContract();

    const adminBalance = await contract.methods.balanceOf(address).call();

    return adminBalance / 10 ** Number(DECIMALS);
  };

  getGasPrices = async () => {
    const response = await fetch(
      `https://ethgasstation.info/api/ethgasAPI.json?api-key=XX${GASSTATIONAPIKEY}XXX`,
    );
    return response.json();
  };
  checkIsAddress = (address: string): boolean => {
    const isValid = this.web3.utils.isAddress(address);
    return isValid;
  };
}

export default Ethereum;
