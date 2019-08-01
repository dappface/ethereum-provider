import React, { useState } from 'react'
import { Button, Padding, PaddingHorizontal } from '../atoms'

export function EthAccounts() {
  const [result, setResult] = useState<string[] | undefined>()
  const [errorMessage, setErrorMessage] = useState('')

  async function run(): Promise<void> {
    setErrorMessage('')
    try {
      const newResult = await window.ethereum.send('eth_accounts')
      setResult(newResult)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <PaddingHorizontal>
      <h2>eth_accounts</h2>
      <Padding>
        <Button onClick={run}>Run</Button>
        {errorMessage ? <div>{errorMessage}</div> : null}
        {typeof result !== 'undefined' ? (
          <pre>{JSON.stringify(result, null, 2)}</pre>
        ) : null}
      </Padding>
    </PaddingHorizontal>
  )
}

export function GetAccounts() {
  const [result, setResult] = useState<string[] | undefined>()
  const [errorMessage, setErrorMessage] = useState('')

  async function run(): Promise<void> {
    setErrorMessage('')
    try {
      const newResult = await window.web3.eth.getAccounts()
      setResult(newResult)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <PaddingHorizontal>
      <h2>getAccounts</h2>
      <Padding>
        <Button onClick={run}>Run</Button>
        {errorMessage ? <div>{errorMessage}</div> : null}
        {typeof result !== 'undefined' ? (
          <pre>{JSON.stringify(result, null, 2)}</pre>
        ) : null}
      </Padding>
    </PaddingHorizontal>
  )
}
