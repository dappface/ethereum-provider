import React from 'react'
import { AccountsChanged, ChangeConnection } from '../event'

export function DappFacePlayground() {
  return (
    <>
      <ChangeConnection />
      <AccountsChanged />
    </>
  )
}
