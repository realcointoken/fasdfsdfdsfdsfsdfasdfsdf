import { NETWORK } from '../../utils/interface'
import Ethereum from '../../helpers/ethereum'

const ethereum = new Ethereum()

const validateCreateSwap = (
  fromNetwork: NETWORK,
  toNetwork: NETWORK,
  toAddress: string,
): boolean => {
  if (fromNetwork.toString() === '' || toNetwork.toString() === '') {
    return false
  }
  if (toNetwork === NETWORK.ethereum) {
    let isAddressValid = ethereum.checkIsAddress(toAddress)
    if (!isAddressValid) {
      return false
    }
  }
  return true
}

export default validateCreateSwap
