export interface recordInterface {
  uuid: number
  fromaddress: string
  toaddress: string
  amount: number | null
  depositaddress: string
  deposit_transaction_hash: string | null
  transfer_transaction_hash: string | null
  fromnetwork: string
  tonetwork: string
  status: string
  block_height: number
  created: Date
}

export interface swapInterface {
  fromAddress: string
  toAddress: string
  fromNetwork: string
  toNetwork: string
  depositAddress: string
  block_height: number
}

export interface ethereumEvent {
  from: string
  to: string
  amount: number
  transactionHash: string
}

export interface avalancheEvent {
  id: string
  inputs: [{ credentials: [{ address: string }] }]
  outputs: [object, object, object]
}

export interface completedSwap {
  unnest: string
}

export interface newSwapInterface {
  uuid: number
  to: string
  amount: number
  depositHashes: string[]
}

export enum STATUS {
  pending = 'pending',
  completed = 'completed',
}
export enum NETWORK {
  ethereum = 'ethereum',
  avax = 'avax',
}
