import { EthereumProvider, WorkerWalletConnection } from 'dappface-provider'
import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import testWallet from '../test-wallet.json'
import { App } from './components'

const walletConnection = new WorkerWalletConnection(testWallet)
const ethereum = new EthereumProvider({
  url: process.env.REMOTE_NODE_URL,
  walletConnection
})

const web3 = new Web3(ethereum as any)

window.web3 = web3
window.ethereum = ethereum

ReactDOM.render(<App />, document.getElementById('root'))
