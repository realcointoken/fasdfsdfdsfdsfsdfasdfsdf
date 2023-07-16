import { db } from '../../sql/db'
import { newSwapInterface, STATUS } from '../../utils/interface'

const updateSwapDetails = async (swap: newSwapInterface): Promise<boolean> => {
  try {
    await db.query(
      'UPDATE swaps SET \
        amount=$1, deposit_transaction_hash=$2, status=$3 WHERE uuid=$4',
      [swap.amount, swap.depositHashes, STATUS.completed, swap.uuid],
    )
  } catch (err) {
    console.log(err)
    return false
  }
  return true
}

export default updateSwapDetails
