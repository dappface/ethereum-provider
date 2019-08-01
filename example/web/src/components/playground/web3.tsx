import React from 'react'
import { GetAccounts, GetBalance, GetCoinbase } from '../eth'
import { NewBlockHeaders } from '../subscription'

export function Web3Playground() {
  return (
    <>
      <GetAccounts />
      <GetCoinbase />
      <GetBalance />

      <NewBlockHeaders />
    </>
  )
}
