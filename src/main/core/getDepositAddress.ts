import dotenv from 'dotenv'
import { NETWORK } from '../../utils/interface'

dotenv.config()

const { DEPOSIT_ETH_ADDRESS, DEPOSIT_AVA_ADDRESS } = process.env

const getDepositAddress = (
  fromNetwork: string,
  toNetwork: string,
): string | undefined => {
  if (fromNetwork === NETWORK.ethereum && toNetwork === NETWORK.avax) {
    return DEPOSIT_ETH_ADDRESS!
  }
  if (fromNetwork === NETWORK.avax && toNetwork === NETWORK.ethereum) {
    return DEPOSIT_AVA_ADDRESS!
  }
}

export default getDepositAddress
