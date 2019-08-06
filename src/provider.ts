import { EventEmitter } from 'events'
import { IConnection, INodeConnection } from './connection'
import {
  IJsonRpcManager,
  JsonRpcManager,
  JsonRpcMethod
} from './json-rpc-manager'

export interface IEthereumProvider {
  send(method: string, params?: string[]): Promise<any>

  // Events
  on(eventName: 'notification', listener: NotificaitonListener): this
  on(eventName: 'connect', listener: ConnectListener): this
  on(eventName: 'close', listener: CloseListener): this
  on(eventName: 'chainChanged', listener: ChainChangedListener): this
  on(eventName: 'networkChanged', listener: NetworkChangedListener): this
  on(eventName: 'accountsChanged', listener: AccountsChangedListener): this

  removeListener(
    eventName: 'notification',
    listener: NotificaitonListener
  ): this
  removeListener(eventName: 'connect', listener: ConnectListener): this
  removeListener(eventName: 'close', listener: CloseListener): this
  removeListener(
    eventName: 'chainChanged',
    listener: ChainChangedListener
  ): this
  removeListener(
    eventName: 'networkChanged',
    listener: NetworkChangedListener
  ): this
  removeListener(
    eventName: 'accountsChanged',
    listener: AccountsChangedListener
  ): this
}

export interface IDappFaceEthereumProvider extends IEthereumProvider {
  isDappFace: true

  postMessage: (message: string) => void
}

interface IEthereumProviderParams {
  nodeConnection: INodeConnection | string
  walletConnection?: IConnection
}

export class EthereumProvider extends EventEmitter
  implements IDappFaceEthereumProvider {
  public readonly isDappFace = true
  private jsonRpcManager: IJsonRpcManager
  private networkId: string | undefined
  private chainId: string | undefined

  constructor({ nodeConnection, walletConnection }: IEthereumProviderParams) {
    super()
    this.jsonRpcManager = new JsonRpcManager({
      nodeConnection,
      walletConnection
    })

    this.addAllListeners()
  }

  public send(method: string, params: string[] = []): Promise<any> {
    return this.jsonRpcManager.send(method, params)
  }

  public postMessage(message: string): void {
    this.jsonRpcManager.onMessage(message)
  }

  // // Web3 1.0 provider provider backwards compatibility
  // public sendAsync(payload: IPayload, callback: Callback) {
  //   console.log('TODO: sendAsync)
  // }

  // // EIP1102 https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1102.md
  // public enable() {
  //   console.log('TODO: enable')
  // }

  async updateChainId(): Promise<void> {
    const newChainId = await this.send(JsonRpcMethod.EthChainId)
    if (newChainId instanceof Error || this.chainId === newChainId) {
      return
    }

    if (typeof this.chainId !== 'undefined') {
      this.emitChainChanged(newChainId)
    }

    this.chainId = newChainId
  }

  private async updateNetworkId(): Promise<void> {
    const newNetworkId = await this.send(JsonRpcMethod.NetVersion)
    if (newNetworkId instanceof Error || this.networkId === newNetworkId) {
      return
    }

    if (typeof this.networkId !== 'undefined') {
      this.emitNetworkChanged(newNetworkId)
    }

    this.networkId = newNetworkId
  }

  // Events
  private addAllListeners(): void {
    this.jsonRpcManager.on('notification', this.emitNotification.bind(this))
    this.jsonRpcManager.on('connect', this.onConnect.bind(this))
    this.jsonRpcManager.on('close', this.emitClose.bind(this))
    this.jsonRpcManager.on('chainChanged', this.emitChainChanged.bind(this))
    this.jsonRpcManager.on('networkChanged', this.emitNetworkChanged.bind(this))
    this.jsonRpcManager.on(
      'accountsChanged',
      this.emitAccountsChanged.bind(this)
    )
  }

  private onConnect(): void {
    this.emitConnect()
    this.updateChainId()
    this.updateNetworkId()
  }

  private emitNotification(result: any): void {
    this.emit('notification', result)
  }

  private emitConnect(): void {
    this.emit('connect')
  }

  private emitClose(code: number, reason: string): void {
    this.emit('close', code, reason)
  }

  private emitChainChanged(chainId: string): void {
    this.emit('chainChanged', chainId)
  }

  private emitNetworkChanged(networkId: string): void {
    this.emit('networkChanged', networkId)
  }

  private emitAccountsChanged(accounts: string[]): void {
    this.emit('accountsChanged', accounts)
  }
}

type NotificaitonListener = (result: any) => void
type ConnectListener = () => void
type CloseListener = (code: number, reason: string) => void
type ChainChangedListener = (chainId: string) => void
type NetworkChangedListener = (networkId: string) => void
type AccountsChangedListener = (accounts: string[]) => void
