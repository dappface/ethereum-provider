import WS from 'jest-websocket-mock'
import { EthereumProvider, JsonRpcMethod } from '..'

let uuidCount = 0
jest.mock('uuid/v4', (): { default: () => string } => ({
  default: (): string => (uuidCount++).toString()
}))

describe('EthereumProvider', (): void => {
  afterEach((): void => {
    WS.clean()
    uuidCount = 0
  })

  it('has dappface flag', (): void => {
    const provider = new EthereumProvider({ url: 'ws://localhost:1234' })
    expect(provider.isDappFace).toBe(true)
  })

  describe('chainChangedl', (): void => {
    it('emits event on reconnection', async (done): Promise<void> => {
      const server1 = new WS('ws://localhost:1234')
      const server2 = new WS('ws://localhost:1235')
      const provider = new EthereumProvider({ url: 'ws://localhost:1234' })

      server1.on('connection', (socket): void => {
        socket.on('message', (message): void => {
          const data = JSON.parse(message as any)
          if (data.method !== JsonRpcMethod.EthChainId) {
            return
          }

          server1.send(
            JSON.stringify({
              id: data.id,
              jsonrpc: data.jsonrpc,
              method: data.method,
              result: '0x1'
            })
          )

          provider.postMessage(
            JSON.stringify({
              id: '0',
              jsonrpc: '2.0',
              method: JsonRpcMethod.DFChangeConnection,
              params: ['ws://localhost:1235']
            })
          )
        })
      })

      server2.on('connection', (socket): void => {
        socket.on('message', (message): void => {
          const data = JSON.parse(message as any)
          if (data.method !== JsonRpcMethod.EthChainId) {
            return
          }
          server2.send(
            JSON.stringify({
              id: data.id,
              jsonrpc: data.jsonrpc,
              method: data.method,
              result: '0x2'
            })
          )
        })
      })

      const handleChainChanged = jest.fn()
      provider.on('chainChanged', handleChainChanged)
      setTimeout((): void => {
        expect(handleChainChanged).toHaveBeenCalledWith('0x2')
        done()
      }, 100)
    })

    it('does not emit event if new chain id is the same', async (done): Promise<
      void
    > => {
      const server1 = new WS('ws://localhost:1234')
      const server2 = new WS('ws://localhost:1235')
      const provider = new EthereumProvider({ url: 'ws://localhost:1234' })

      server1.on('connection', (socket): void => {
        socket.on('message', (message): void => {
          const data = JSON.parse(message as any)
          if (data.method !== JsonRpcMethod.EthChainId) {
            return
          }

          server1.send(
            JSON.stringify({
              id: data.id,
              jsonrpc: data.jsonrpc,
              method: data.method,
              result: '0x1'
            })
          )

          provider.postMessage(
            JSON.stringify({
              id: '0',
              jsonrpc: '2.0',
              method: JsonRpcMethod.DFChangeConnection,
              params: ['ws://localhost:1235']
            })
          )
        })
      })

      server2.on('connection', (socket): void => {
        socket.on('message', (message): void => {
          const data = JSON.parse(message as any)
          if (data.method !== JsonRpcMethod.EthChainId) {
            return
          }
          server2.send(
            JSON.stringify({
              id: data.id,
              jsonrpc: data.jsonrpc,
              method: data.method,
              result: '0x1'
            })
          )
        })
      })

      const handleChainChanged = jest.fn()
      provider.on('chainChanged', handleChainChanged)
      setTimeout((): void => {
        expect(handleChainChanged).not.toHaveBeenCalled()
        done()
      }, 100)
    })
  })

  describe('networkChanged', (): void => {
    it('emits event on reconnection', async (done): Promise<void> => {
      const server1 = new WS('ws://localhost:1234')
      const server2 = new WS('ws://localhost:1235')
      const provider = new EthereumProvider({ url: 'ws://localhost:1234' })

      server1.on('connection', (socket): void => {
        socket.on('message', (message): void => {
          const data = JSON.parse(message as any)
          if (data.method !== JsonRpcMethod.NetVersion) {
            return
          }

          server1.send(
            JSON.stringify({
              id: data.id,
              jsonrpc: data.jsonrpc,
              method: data.method,
              result: '1'
            })
          )

          provider.postMessage(
            JSON.stringify({
              id: '0',
              jsonrpc: '2.0',
              method: JsonRpcMethod.DFChangeConnection,
              params: ['ws://localhost:1235']
            })
          )
        })
      })

      server2.on('connection', (socket): void => {
        socket.on('message', (message): void => {
          const data = JSON.parse(message as any)
          if (data.method !== JsonRpcMethod.NetVersion) {
            return
          }
          server2.send(
            JSON.stringify({
              id: data.id,
              jsonrpc: data.jsonrpc,
              method: data.method,
              result: '2'
            })
          )
        })
      })

      const handleNetworkChanged = jest.fn()
      provider.on('networkChanged', handleNetworkChanged)
      setTimeout((): void => {
        expect(handleNetworkChanged).toHaveBeenCalledWith('2')
        done()
      }, 100)
    })

    it('does not emit event if new network id is the same', async (done): Promise<
      void
    > => {
      const server1 = new WS('ws://localhost:1234')
      const server2 = new WS('ws://localhost:1235')
      const provider = new EthereumProvider({ url: 'ws://localhost:1234' })

      server1.on('connection', (socket): void => {
        socket.on('message', (message): void => {
          const data = JSON.parse(message as any)
          if (data.method !== JsonRpcMethod.NetVersion) {
            return
          }

          server1.send(
            JSON.stringify({
              id: data.id,
              jsonrpc: data.jsonrpc,
              method: data.method,
              result: '1'
            })
          )

          provider.postMessage(
            JSON.stringify({
              id: '0',
              jsonrpc: '2.0',
              method: JsonRpcMethod.DFChangeConnection,
              params: ['ws://localhost:1235']
            })
          )
        })
      })

      server2.on('connection', (socket): void => {
        socket.on('message', (message): void => {
          const data = JSON.parse(message as any)
          if (data.method !== JsonRpcMethod.NetVersion) {
            return
          }
          server2.send(
            JSON.stringify({
              id: data.id,
              jsonrpc: data.jsonrpc,
              method: data.method,
              result: '1'
            })
          )
        })
      })

      const handleNetworkChanged = jest.fn()
      provider.on('networkChanged', handleNetworkChanged)
      setTimeout((): void => {
        expect(handleNetworkChanged).not.toHaveBeenCalled()
        done()
      }, 100)
    })
  })

  it('emits notification', async (done): Promise<void> => {
    const server = new WS('ws://localhost:1234')
    const provider = new EthereumProvider({ url: 'ws://localhost:1234' })

    await server.connected

    provider.on('notification', (result): void => {
      expect(result).toBe('pina colada')
      done()
    })

    server.send(
      JSON.stringify({
        jsonrpc: '2.0',
        method: JsonRpcMethod.EthSubscription,
        params: 'pina colada'
      })
    )
  })

  it('emits accountsChanged', (done): void => {
    new WS('ws://localhost:1234')
    const provider = new EthereumProvider({ url: 'ws://localhost:1234' })

    provider.on('accountsChanged', (accounts): void => {
      expect(accounts).toEqual(['account1', 'account2'])
      done()
    })

    provider.postMessage(
      JSON.stringify({
        jsonrpc: '2.0',
        method: JsonRpcMethod.DFAccountsChanged,
        result: ['account1', 'account2']
      })
    )
  })

  it('sends message to remote node and resolves result', async (): Promise<
    void
  > => {
    const server = new WS('ws://localhost:1234')
    const provider = new EthereumProvider({ url: 'ws://localhost:1234' })

    server.on('connection', (socket): void => {
      socket.on('message', (message): void => {
        // Details: https://github.com/romgain/jest-websocket-mock/blob/master/src/websocket.ts#L47
        const data = JSON.parse(message as any)
        if (data.method !== JsonRpcMethod.EthAccounts) {
          return
        }

        server.send(
          JSON.stringify({
            id: data.id,
            jsonrpc: data.jsonrpc,
            method: data.method,
            result: ['account1', 'account2']
          })
        )
      })
    })

    const result = await provider.send(JsonRpcMethod.EthAccounts)
    expect(result).toEqual(['account1', 'account2'])
  })
})
