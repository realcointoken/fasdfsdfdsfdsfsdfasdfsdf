import { db } from '../../sql/db'
import { recordInterface, STATUS } from '../../utils/interface'

const getSwaps = async (from: string) => {
  try {
    let swaps: {
      rows: recordInterface[]
    } = await db.query(
      'SELECT * FROM Swaps WHERE fromAddress = $1 AND status=$2',
      [from, STATUS.pending],
    )

    return swaps.rows
  } catch (err) {
    console.log(err)
  }
}

export default getSwaps
