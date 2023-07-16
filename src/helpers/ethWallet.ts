import 'dotenv/config'
import { ethers, Contract } from 'ethers'
import { ERC20ABI } from '../config/ERC20ABI'

export default class ethWallet {
  wallet: any

  constructor(network: string) {
    let provider = ethers.getDefaultProvider(network)
    this.wallet = this.createWalletFromMnemonic().connect(provider)
  }

  createWalletFromMnemonic() {
    let mnemonic = process.env.MNEMONIC
    if (!mnemonic) {
      throw new Error('Mnemonic not provided in .env')
    }

    return ethers.Wallet.fromMnemonic(mnemonic)
  }

  async getTokenBalance(tokenAddress: string) {
    const token = new Contract(tokenAddress, ERC20ABI.abi, this.wallet)
    let address = this.wallet.getAddress()

    let balance = await token.balanceOf(address)
    return balance
  }

  async getTokenAllowance(tokenAddress: string, spender: string) {
    const token = new Contract(tokenAddress, ERC20ABI.abi, this.wallet)
    let address = this.wallet.getAddress()

    let balance = await token.allowance(address, spender)
    return balance
  }
}
