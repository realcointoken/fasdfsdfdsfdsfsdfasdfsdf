export default abstract class BaseChainClass {
  wallet: any

  abstract transfer: (to: string, amount: number) => Promise<any>

  abstract getDepositTransactions: <T>(
    depositAddress: string,
    block_height: number,
  ) => Promise<T[] | null>

  abstract setWallet: (wallet: Promise<any>) => void
}
