import { EventEmitter } from 'events'
import uuid from 'uuid/v4'
import {
  IConnection,
  INodeConnection,
  WebSocketNodeConnection
} from './connection'
import { IPromiseManager, PromiseManager } from './promise-manager'

export interface IJsonRpcManager {
  send(method: string, params: string[]): Promise<any>
  onMessage(message: string): void

  // Events
  on(eventName: 'notification', listener: (result: any) => void): this
  on(eventName: 'connect', listener: () => void): this
  on(eventName: 'close', listener: (code: number, reason: string) => void): this
  on(eventName: 'chainChanged', listener: (chainId: string) => void): this
  on(eventName: 'networkChanged', listener: (networkId: string) => void): this
  on(eventName: 'accountsChanged', listener: (accounts: string[]) => void): this
}

interface IJsonRpcManagerParams {
  nodeConnection?: INodeConnection
  url: string
  walletConnection?: IConnection
}

export enum JsonRpcMethod {
  EthAccounts = 'eth_accounts',
  EthCoinbase = 'eth_coinbase',
  EthSendTransaction = 'eth_sendTransaction',
  EthSign = 'eth_sign',
  EthSignTypedData = 'eth_signTypedData',
  EthSignTypedDataV0 = 'eth_signTypedData_v0',
  EthSignTypedDataV3 = 'eth_signTypedData_v3',
  PersonalSign = 'personal_sign',
  PersonalEcRecover = 'personal_ecRecover',

  EthChainId = 'eth_chainId',
  NetVersion = 'net_version',
  EthSubscription = 'eth_subscription',

  // dappface specific
  DFAccountsChanged = 'df_accountsChanged',
  DFChangeConnection = 'df_changeConnection',
  DFSocketClosed = 'df_socketClosed',
  DFSocketConnected = 'df_socketConnected',
  DFSocketMessage = 'df_socketMessage'
}

export class JsonRpcManager extends EventEmitter implements IJsonRpcManager {
  private static createMessage(
    method: string,
    params: string[]
  ): { id: string; message: string } {
    const message: IJsonRpcMessage = {
      id: uuid(),
      jsonrpc: '2.0',
      method,
      params
    }

    return {
      id: message.id,
      message: JSON.stringify(message)
    }
  }

  private static validateMessage(
    message: string
  ): { [key: string]: any } | Error {
    let data
    try {
      data = JSON.parse(message)
    } catch (error) {
      return new Error('JsonRpcManager: Failed to parse message')
    }

    if (data.jsonrpc !== '2.0') {
      return new Error(
        'JsonRpcManager: Message does not contain jsonrpc property with a value of 2.0'
      )
    }

    if (JsonRpcManager.isDappFaceMessage(data)) {
      switch (data.method) {
        case JsonRpcMethod.DFChangeConnection: {
          if (!(data.params instanceof Array) || data.params.length === 0) {
            return new Error('JsonRpcManager: Remote node url is missing')
          }

          const err = JsonRpcManager.validateUrl(data.params[0])
          if (err) {
            return err
          }
        }
        default:
          break
      }
    }

    return data
  }

  private static isDappFaceMessage(data: { [key: string]: any }): boolean {
    return data.method && data.method.indexOf('df_') > -1
  }

  private static isSubscriptionMessage(data: { [key: string]: any }): boolean {
    return data.method && data.method.indexOf('_subscription') > -1
  }

  private static validateSendParams(
    method: string,
    params: string[]
  ): Error | true {
    if (typeof method !== 'string') {
      return new Error('JsonRpcManager: Method is not a valid string.')
    }

    if (!(params instanceof Array)) {
      return new Error('JsonRpcManager: Params is not a valid array.')
    }

    return true
  }

  private static validateUrl(url: any): Error | undefined {
    const localhostPattern = /^ws:\/\/localhost:\d{4}$/
    const pattern = new RegExp(
      '^(wss?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    )

    if (!localhostPattern.test(url) && !pattern.test(url)) {
      return new Error('JsonRpcManager: Invalid remote node url')
    }

    return
  }

  private nodeConnection: INodeConnection
  private promiseManager: IPromiseManager = new PromiseManager()
  private walletConnection?: IConnection

  constructor({
    nodeConnection,
    url,
    walletConnection
  }: IJsonRpcManagerParams) {
    super()
    this.nodeConnection = nodeConnection || new WebSocketNodeConnection(url)
    this.walletConnection = walletConnection

    this.addAllListeners()
  }

  public async send(method: string, params: string[]): Promise<any> {
    const result = JsonRpcManager.validateSendParams(method, params)
    if (result instanceof Error) {
      return Promise.reject(result)
    }

    const { id, message } = JsonRpcManager.createMessage(method, params)
    const promise = this.promiseManager.register(id)

    if (typeof this.walletConnection !== 'undefined') {
      switch (method) {
        case JsonRpcMethod.EthAccounts:
        case JsonRpcMethod.EthCoinbase:
        case JsonRpcMethod.EthSign:
        case JsonRpcMethod.PersonalSign:
        case JsonRpcMethod.EthSendTransaction:
        case JsonRpcMethod.EthSignTypedData:
        case JsonRpcMethod.EthSignTypedDataV0:
        case JsonRpcMethod.EthSignTypedDataV3:
        case JsonRpcMethod.PersonalEcRecover:
          this.walletConnection.send(message)
          return promise
        default:
          break
      }
    }

    this.nodeConnection.send(message)
    return promise
  }

  public onMessage(message: string): void {
    const data = JsonRpcManager.validateMessage(message)
    if (data instanceof Error) {
      throw data
    }

    if (JsonRpcManager.isSubscriptionMessage(data)) {
      this.emitNotification(data.params)
      return
    }

    if (data.error) {
      this.promiseManager.reject(data.id, data.error)
      return
    }

    switch (data.method) {
      case JsonRpcMethod.DFChangeConnection:
        this.nodeConnection.close()
        this.nodeConnection.connect(data.params[0])
        return
      case JsonRpcMethod.DFAccountsChanged:
        this.emitAccountsChanged(data.result)
        return
      case JsonRpcMethod.DFSocketClosed:
        this.emitClose(data.params[0], data.params[1])
        return
      case JsonRpcMethod.DFSocketConnected:
        this.emitConnect()
        return
      case JsonRpcMethod.DFSocketMessage:
        this.emitNotification(data.params)
        return
      default:
        this.promiseManager.resolve(data.id, data.result)
        return
    }
  }

  // Events
  private addAllListeners(): void {
    this.nodeConnection.on('message', this.onMessage.bind(this))
    this.nodeConnection.on('connect', this.emitConnect.bind(this))
    this.nodeConnection.on('close', this.emitClose.bind(this))
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

  private emitAccountsChanged(accounts: string[]): void {
    this.emit('accountsChanged', accounts)
  }
}

interface IJsonRpcMessage {
  id: string
  jsonrpc: '2.0'
  method: string
  params: string[]
}
