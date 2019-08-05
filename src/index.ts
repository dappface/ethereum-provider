export { EthereumProvider, IEthereumProvider } from './provider'
export {
  IConnection,
  INodeConnection,
  ITestWallet,
  ReactNativeWalletConnection,
  ReactNativeWebSocketNodeConnection,
  WebSocketNodeConnection,
  WorkerWalletConnection
} from './connection'
export { JsonRpcMethod } from './json-rpc-manager'

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: (message: string) => void
    }
  }
}
