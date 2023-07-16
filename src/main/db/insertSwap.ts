import { v4 as uuidv4 } from 'uuid'
import { db } from '../../sql/db'
import { swapInterface, recordInterface, STATUS } from '../../utils/interface'

const insertSwap = async (swapDetails: swapInterface) => {
  const uuid = uuidv4()

  try {
    let swap: {
      rows: recordInterface[]
    } = await db.query(
      'INSERT INTO Swaps (uuid, fromAddress, toAddress,depositaddress, fromNetwork, toNetwork, status, block_height, created) \
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,now()) \
        RETURNING uuid, fromaddress, toaddress, depositaddress, fromnetwork, tonetwork, status, block_height',
      [
        uuid,
        swapDetails.fromAddress,
        swapDetails.toAddress,
        swapDetails.depositAddress,
        swapDetails.fromNetwork,
        swapDetails.toNetwork,
        STATUS.pending,
        swapDetails.block_height,
      ],
    )
    console.log('***************Swap Inserted***************')

    return swap.rows[0]
  } catch (err) {
    console.log(err)
    return err
  }
}

export default insertSwap
