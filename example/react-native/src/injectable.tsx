import {
  EthereumProvider,
  ReactNativeWalletConnection,
  ReactNativeWebSocketNodeConnection
} from '@dappface/ethereum-provider'
import React from 'react'
import ReactDOM from 'react-dom'
import { App } from '../../web/src/components'

declare global {
  interface Window {
    ethereum: EthereumProvider
  }
}

const walletConnection = new ReactNativeWalletConnection()
const nodeConnection = new ReactNativeWebSocketNodeConnection()
const ethereum = new EthereumProvider({
  url: `wss://rinkeby.infura.io/ws/v3/${process.env.INFURA_PROJECT_ID}`,
  walletConnection
})

window.ethereum = ethereum

ReactDOM.render(<App />, document.getElementById('root'))
