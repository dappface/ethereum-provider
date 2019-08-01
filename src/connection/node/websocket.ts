import { EventEmitter } from 'events'
import { INodeConnection } from './type'

export class WebSocketNodeConnection extends EventEmitter
  implements INodeConnection {
  private url: string
  private ws: WebSocket | undefined

  constructor(url: string) {
    super()

    this.url = url
    this.connect()
  }

  public send(message: string): void {
    ;(this.ws as WebSocket).send(message)
  }

  public close(): void {
    ;(this.ws as WebSocket).close()
    window.removeEventListener('beforeunload', this.close.bind(this))
  }

  public connect(url?: string): void {
    if (url) {
      this.url = url
    }
    this.ws = new WebSocket(this.url)
    this.ws.onopen = this.onOpen.bind(this)
    this.ws.onclose = this.onClose.bind(this)
    this.ws.onmessage = this.onMessage.bind(this)

    window.addEventListener('beforeunload', this.close.bind(this))
  }

  private reconnect(): void {
    setTimeout((): void => {
      this.connect()
    }, 5000)
  }

  private onOpen(): void {
    this.emit('connect')
  }

  private onClose(e: CloseEvent): void {
    this.emit('close', e.code, e.reason)
    if (e.code === 1000 || e.wasClean) {
      return
    }
    this.reconnect()
  }

  private onMessage(e: MessageEvent): void {
    this.emit('message', e.data)
  }
}
