import { IConnection } from '../type'

export interface INodeConnection extends IConnection {
  close(): void
  connect(url: string): void

  // Events
  on(eventName: 'message', listener: (message: string) => void): this
  on(eventName: 'connect', listener: () => void): this
  on(eventName: 'close', listener: (code: number, reason: string) => void): this
}
