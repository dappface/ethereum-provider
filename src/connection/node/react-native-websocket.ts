import { EventEmitter } from 'events'
import { INodeConnection } from './type'

export class ReactNativeWebSocketNodeConnection extends EventEmitter
  implements INodeConnection {
  public send(message: string): void {
    window.ReactNativeWebView.postMessage(message)
  }

  public close(): void {
    const message = JSON.stringify({ method: 'df_closeSocket' })
    window.ReactNativeWebView.postMessage(message)
  }

  public connect(): void {
    const message = JSON.stringify({ method: 'df_connectSocket' })
    window.ReactNativeWebView.postMessage(message)
  }
}
