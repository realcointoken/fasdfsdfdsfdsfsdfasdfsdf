import { db } from '../../sql/db'
import { recordInterface, STATUS } from '../../utils/interface'

const getSwapById = async (uuid: string) => {
  try {
    let swaps: {
      rows: recordInterface[]
    } = await db.query('SELECT * FROM Swaps WHERE uuid = $1 AND status=$2', [
      uuid,
      STATUS.pending,
    ])

    return swaps.rows
  } catch (err) {
    console.log(err)
  }
}

export default getSwapById
