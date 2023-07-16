import { NETWORK } from '../../utils/interface'
//import Ethereum from '../../helpers/ethereum'
import Avalanche from '../../helpers/avalanche'

//const ethereum = new Ethereum()
const avalanche = new Avalanche()

const calculateSendAmount = (
  transactions: any,
  fromNetwork: string,
  toNetwork: string,
) => {
  let sendAmount = 0
  if (fromNetwork === NETWORK.ethereum && toNetwork === NETWORK.avax) {
    for (let tx of transactions) {
      sendAmount += tx.amount * 10 ** 12
    }
    return sendAmount
  }
  if (fromNetwork === NETWORK.avax && toNetwork === NETWORK.ethereum) {
    let amount = avalanche.calculateSendAmount(transactions)
    return amount
  }
}

export default calculateSendAmount
