import React, { useState } from 'react'
import { Button, Column, Padding, PaddingHorizontal } from '../atoms'

export function EthGetBalance() {
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  function onChangeAccount(e: React.ChangeEvent<HTMLInputElement>): void {
    setAccount(e.target.value)
  }

  async function run(): Promise<void> {
    setErrorMessage('')
    try {
      const wei = await window.ethereum.send('eth_getBalance', [
        account,
        'latest'
      ])
      const eth = window.web3.utils.fromWei(wei, 'ether')
      setBalance(`${eth} ETH`)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <PaddingHorizontal>
      <h2>eth_getBalance</h2>
      <Padding>
        <Column>
          <input
            onChange={onChangeAccount}
            placeholder='0x000...'
            value={account}
          />
          <Button onClick={run}>Run</Button>
          {errorMessage ? <div>{errorMessage}</div> : null}
          {balance}
        </Column>
      </Padding>
    </PaddingHorizontal>
  )
}

export function GetBalance() {
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  function onChangeAccount(e: React.ChangeEvent<HTMLInputElement>): void {
    setAccount(e.target.value)
  }

  async function run(): Promise<void> {
    setErrorMessage('')
    try {
      const wei = await window.web3.eth.getBalance(account)
      const eth = window.web3.utils.fromWei(wei, 'ether')
      setBalance(`${eth} ETH`)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <PaddingHorizontal>
      <h2>getBalance</h2>
      <Padding>
        <Column>
          <input
            onChange={onChangeAccount}
            placeholder='0x000...'
            value={account}
          />
          <Button onClick={run}>Run</Button>
          {errorMessage ? <div>{errorMessage}</div> : null}
          {balance}
        </Column>
      </Padding>
    </PaddingHorizontal>
  )
}
