import React from 'react'
import { EthAccounts, EthCoinbase, EthGetBalance } from '../eth'
import { EthSubscribeNewHeads } from '../subscription'

export function EthereumPlayground() {
  return (
    <>
      <EthAccounts />
      <EthCoinbase />
      <EthGetBalance />
      <EthSubscribeNewHeads />
    </>
  )
}
