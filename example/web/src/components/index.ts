import { EthereumProvider } from 'dappface-provider'
import Web3 from 'web3'

export { App } from './app'

declare global {
  interface Window {
    ethereum: EthereumProvider
    web3: Web3
  }
}
