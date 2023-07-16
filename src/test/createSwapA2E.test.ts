//import Models from '../main/index'
/* import Ethereum from '../helpers/ethereum'
import Avalanche from '../helpers/avalanche' */
//import app from '../server'
//import { dbTest } from '../sql/db'

/* import { expect } from 'chai'
import 'mocha'
import fetch from 'node-fetch'
let server: any */

/* const FROM: string = 'X-fuji1xlvaj0wezrp4j00legxag54fckn4ucve9gylqzy'
const TO: string = '0xFA6226B8C1F4A940C270e33Dd0dFae62FFbD1E19'
//const AMOUNT: number = 10

before((done) => {
  server = app.listen(3000, () => {
    console.log(`Server is started on port 3000`)
    done()
  })
})

describe('Create Swap', () => {
  let swap: any = null

  before('Create swap', async () => {
    let res = await fetch('http://localhost:3000/api/swap', {
      body: JSON.stringify({
        fromAddress: FROM,
        toAddress: TO,
        fromNetwork: 'avax',
        toNetwork: 'ethereum',
      }),
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
    })
    swap = await res.json()
  })

  //const newModel = new Models()

  it('should swap be created', () => {
    expect(swap).not.empty
  })
})

after((done) => {
  server.close(done)
})
 */
