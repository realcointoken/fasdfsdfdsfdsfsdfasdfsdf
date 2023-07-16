import 'dotenv/config'
import avaRpc from '../config/avaRpc'

const avaWallet = {
  async createWalletFromprivKey() {
    const creds = avaRpc.getUserCreds()

    let privateKey = process.env.AVA_WALLET_PRIVATE_KEY
    if (!privateKey) {
      throw new Error('private key not provided in .env')
    }

    try {
      let response = await avaRpc.call('ext/bc/X', 'avm.importKey', {
        username: creds.username,
        password: creds.password,
        privateKey: privateKey,
      })
      if (response.result) {
        return response.result
      } else {
        console.log(response)
      }
    } catch (err) {
      console.log(err)
    }
  },
}

export default avaWallet
