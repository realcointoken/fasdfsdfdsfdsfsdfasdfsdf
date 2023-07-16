import { newSwapInterface, NETWORK } from "../../utils/interface";
import Ethereum from "../../helpers/ethereum";
import Avalanche from "../../helpers/avalanche";

const ethereum = new Ethereum();
const avalanche = new Avalanche();

const processSwap = async (
  swap: newSwapInterface,
  fromNetwork: string,
  toNetwork: string,
) => {
  if (fromNetwork == NETWORK.ethereum && toNetwork == NETWORK.avax) {
    let txID: object = await avalanche.transfer(swap.to, swap.amount);

    return txID;
  }

  if (fromNetwork === NETWORK.avax && toNetwork === NETWORK.ethereum) {
    //console.log(swap)
    let tx: object = await ethereum.transfer(swap.to, swap.amount);

    return tx;
  }
};

export default processSwap;
