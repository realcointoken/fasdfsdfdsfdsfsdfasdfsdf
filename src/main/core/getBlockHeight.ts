import { NETWORK } from '../../utils/interface'
import Ethereum from '../../helpers/ethereum'

const ethereum = new Ethereum()

const getBlockHeight = async (
  fromNetwork: string,
): Promise<number | undefined> => {
  if (fromNetwork === NETWORK.ethereum) {
    let block_height = await ethereum.getBlockHeight()

    return block_height
  }
}

export default getBlockHeight
