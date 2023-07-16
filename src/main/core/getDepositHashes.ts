import dotenv from 'dotenv'
import { NETWORK, avalancheEvent, ethereumEvent } from '../../utils/interface'
dotenv.config()

const getDepositHashs = (
  transactions: any,
  fromNetwork: string,
): string[] | undefined => {
  let depositTxHash = []

  if (fromNetwork === NETWORK.ethereum) {
    for (let tx of transactions as ethereumEvent[]) {
      depositTxHash.push(tx.transactionHash)
    }
    return depositTxHash
  }
  if (fromNetwork === NETWORK.avax) {
    for (let tx of transactions as avalancheEvent[]) {
      depositTxHash.push(tx.id)
    }
    return depositTxHash
  }
}

export default getDepositHashs
