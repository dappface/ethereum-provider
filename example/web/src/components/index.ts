import { EthereumProvider } from '@dappface/ethereum-provider'
import Web3 from 'web3'

export { App } from './app'

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    ethereum: EthereumProvider
    web3: Web3
  }
}
