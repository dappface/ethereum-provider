import WS from 'jest-websocket-mock'
import { WebSocketNodeConnection } from '../websocket'

describe('WebSocketNodeConnection', (): void => {
  afterEach((): void => {
    WS.clean()
  })

  it('emits connect event', (done): void => {
    new WS('ws://localhost:1234')
    const connection = new WebSocketNodeConnection('ws://localhost:1234')
    const cb = jest.fn(done)
    connection.on('connect', cb)
  })

  it('emits close event with code and reason', (done): void => {
    const server = new WS('ws://localhost:1234')
    const connection = new WebSocketNodeConnection('ws://localhost:1234')
    const cb = jest.fn((code, reason): void => {
      if (typeof code === 'undefined') {
        return
      }
      expect(code).toBe(1000)
      expect(reason).toBe('Oops')
      done()
    })

    connection.on('close', cb)

    server.on('connection', (socket): void => {
      socket.close({ wasClean: true, code: 1000, reason: 'Oops' })
    })
  })

  it('reconnects when connection closes with wasClean property false', (done): void => {
    const server = new WS('ws://localhost:1234')
    const connection = new WebSocketNodeConnection('ws://localhost:1234')

    const cb = jest.fn()
    connection.on('close', cb)

    let count = 0
    server.on('connection', (socket): void => {
      if (count === 1) {
        expect(cb).toBeCalledTimes(1)
        done()
        return
      }
      count = 1
      socket.close({ code: 1005, reason: 'Oops', wasClean: false })
    })
  })

  it('connects to new url', (done): void => {
    new WS('ws://localhost:1234')
    new WS('ws://localhost:1235')
    const connection = new WebSocketNodeConnection('ws://localhost:1234')

    let count = 0
    connection.on('connect', (): void => {
      if (count === 1) {
        done()
      }
      count = 1
    })
    connection.connect('ws://localhost:1235')
  })

  it('emits message', (done): void => {
    const server = new WS('ws://localhost:1234')
    const connection = new WebSocketNodeConnection('ws://localhost:1234')

    connection.on('message', (message): void => {
      expect(message).toBe('pina colada')
      done()
    })

    server.send('pina colada')
  })

  it('sends message', async (): Promise<void> => {
    const server = new WS('ws://localhost:1234')
    const connection = new WebSocketNodeConnection('ws://localhost:1234')

    await server.connected
    connection.send('pina colada')
    await expect(server).toReceiveMessage('pina colada')
  })

  it('closes connection', async (done): Promise<void> => {
    const server = new WS('ws://localhost:1234')
    const connection = new WebSocketNodeConnection('ws://localhost:1234')
    connection.on('close', done)

    await server.connected
    connection.close()
  })
})
