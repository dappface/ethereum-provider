import { IConnection } from '../type'

export class ReactNativeWalletConnection implements IConnection {
  public send(message: string): void {
    window.ReactNativeWebView.postMessage(message)
  }
}
