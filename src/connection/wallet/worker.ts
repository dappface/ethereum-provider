import { IConnection, ITestWallet } from '../type'
// @ts-ignore
import Worker from './background.worker.ts'

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    ethereum: {
      postMessage: (message: string) => void
    }
  }
}

export class WorkerWalletConnection implements IConnection {
  private worker: Worker

  constructor(testWallet: ITestWallet) {
    this.worker = new Worker()

    this.addResponseListener()
    this.initTestWallet(testWallet)
  }

  public send(message: string): void {
    this.worker.postMessage(message)
  }

  private initTestWallet(testWallet: ITestWallet): void {
    const message = {
      method: 'df_initTestWallet',
      params: [testWallet]
    }
    const messageStr = JSON.stringify(message)

    this.send(messageStr)
  }

  // Events
  private addResponseListener(): void {
    this.worker.onmessage = (e: MessageEvent): void => {
      window.ethereum.postMessage(e.data)
    }
  }
}
