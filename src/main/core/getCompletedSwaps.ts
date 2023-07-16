import { db } from '../../sql/db'
import { STATUS, completedSwap } from '../../utils/interface'

const getCompletedSwaps = async (from: string) => {
  try {
    let swaps: {
      rows: completedSwap[]
    } = await db.query(
      'SELECT unnest(deposit_transaction_hash) FROM Swaps WHERE fromAddress=$1 AND status=$2',
      [from, STATUS.completed],
    )

    return swaps.rows
  } catch (err) {
    console.log(err)
  }
}

export default getCompletedSwaps
