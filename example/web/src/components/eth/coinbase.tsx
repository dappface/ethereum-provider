import React, { useState } from 'react'
import { Button, Padding, PaddingHorizontal } from '../atoms'

export function EthCoinbase() {
  const [result, setResult] = useState<string | null | undefined>()
  const [errorMessage, setErrorMessage] = useState('')

  async function run(): Promise<void> {
    setErrorMessage('')
    try {
      const newResult = await window.ethereum.send('eth_coinbase')
      setResult(newResult)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <PaddingHorizontal>
      <h2>eth_coinbase</h2>
      <Padding>
        <Button onClick={run}>Run</Button>
        {errorMessage ? <div>{errorMessage}</div> : null}
        {typeof result !== 'undefined' ? (
          <div>{result !== null ? result : '-'}</div>
        ) : null}
      </Padding>
    </PaddingHorizontal>
  )
}

export function GetCoinbase() {
  const [result, setResult] = useState<string | null | undefined>()
  const [errorMessage, setErrorMessage] = useState('')

  async function run(): Promise<void> {
    setErrorMessage('')
    try {
      const newResult = await window.web3.eth.getCoinbase()
      setResult(newResult)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <PaddingHorizontal>
      <h2>getCoinbase</h2>
      <Padding>
        <Button onClick={run}>Run</Button>
        {errorMessage ? <div>{errorMessage}</div> : null}
        {typeof result !== 'undefined' ? (
          <div>{result !== null ? result : '-'}</div>
        ) : null}
      </Padding>
    </PaddingHorizontal>
  )
}
