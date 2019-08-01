import WS from 'jest-websocket-mock'
import { IConnection, INodeConnection, JsonRpcMethod } from '..'
import { JsonRpcManager } from '../json-rpc-manager'

let uuidCount = 0
jest.mock('uuid/v4', () => (): string => (uuidCount++).toString())

describe('JsonRpcManager', (): void => {
  afterEach((): void => {
    WS.clean()
    uuidCount = 0
  })

  describe('send', (): void => {
    it('sends message to node', async (): Promise<void> => {
      const server = new WS('ws://localhost:1234')
      const jsonRpc = new JsonRpcManager({ url: 'ws://localhost:1234' })

      await server.connected

      jsonRpc.send('servePinacolada', [])
      await expect(server).toReceiveMessage(
        JSON.stringify({
          id: '0',
          jsonrpc: '2.0',
          method: 'servePinacolada',
          params: []
        })
      )
    })

    it('resolve message from node', async (): Promise<void> => {
      const server = new WS('ws://localhost:1234')
      const jsonRpc = new JsonRpcManager({ url: 'ws://localhost:1234' })

      await server.connected

      server.nextMessage.then((): void => {
        server.send(
          JSON.stringify({
            id: '0',
            jsonrpc: '2.0',
            method: JsonRpcMethod.EthAccounts,
            result: ['account1', 'account2']
          })
        )
      })

      const result = await jsonRpc.send(JsonRpcMethod.EthAccounts, [])
      expect(result).toEqual(['account1', 'account2'])
    })

    it('throws error when method is not a string', async (): Promise<void> => {
      const server = new WS('ws://localhost:1234')
      const jsonRpc = new JsonRpcManager({ url: 'ws://localhost:1234' })

      await server.connected

      return expect(
        // @ts-ignore
        jsonRpc.send(undefined, [])
      ).rejects.toEqual(
        new Error('JsonRpcManager: Method is not a valid string.')
      )
    })

    it('throws error when params is not an array', async (): Promise<void> => {
      const server = new WS('ws://localhost:1234')
      const jsonRpc = new JsonRpcManager({ url: 'ws://localhost:1234' })

      await server.connected

      return expect(
        // @ts-ignore
        jsonRpc.send('servePinacolada')
      ).rejects.toEqual(
        new Error('JsonRpcManager: Params is not a valid array.')
      )
    })

    it('proxies message to wallet connection', async (): Promise<void> => {
      const server = new WS('ws://localhost:1234')
      const walletConnection: IConnection = {
        send: jest.fn()
      }
      const jsonRpc = new JsonRpcManager({
        url: 'ws://localhost:1234',
        walletConnection
      })

      await server.connected

      jsonRpc.send(JsonRpcMethod.EthAccounts, [])
      jsonRpc.send(JsonRpcMethod.EthCoinbase, [])
      jsonRpc.send(JsonRpcMethod.EthSign, [])
      jsonRpc.send(JsonRpcMethod.PersonalSign, [])
      jsonRpc.send(JsonRpcMethod.EthSendTransaction, [])
      jsonRpc.send(JsonRpcMethod.EthSignTypedData, [])
      jsonRpc.send(JsonRpcMethod.EthSignTypedDataV0, [])
      jsonRpc.send(JsonRpcMethod.EthSignTypedDataV3, [])
      jsonRpc.send(JsonRpcMethod.PersonalEcRecover, [])

      expect(walletConnection.send).toHaveBeenNthCalledWith(
        1,
        JSON.stringify({
          id: '0',
          jsonrpc: '2.0',
          method: JsonRpcMethod.EthAccounts,
          params: []
        })
      )

      expect(walletConnection.send).toHaveBeenNthCalledWith(
        2,
        JSON.stringify({
          id: '1',
          jsonrpc: '2.0',
          method: JsonRpcMethod.EthCoinbase,
          params: []
        })
      )

      expect(walletConnection.send).toHaveBeenNthCalledWith(
        3,
        JSON.stringify({
          id: '2',
          jsonrpc: '2.0',
          method: JsonRpcMethod.EthSign,
          params: []
        })
      )

      expect(walletConnection.send).toHaveBeenNthCalledWith(
        4,
        JSON.stringify({
          id: '3',
          jsonrpc: '2.0',
          method: JsonRpcMethod.PersonalSign,
          params: []
        })
      )

      expect(walletConnection.send).toHaveBeenNthCalledWith(
        5,
        JSON.stringify({
          id: '4',
          jsonrpc: '2.0',
          method: JsonRpcMethod.EthSendTransaction,
          params: []
        })
      )

      expect(walletConnection.send).toHaveBeenNthCalledWith(
        6,
        JSON.stringify({
          id: '5',
          jsonrpc: '2.0',
          method: JsonRpcMethod.EthSignTypedData,
          params: []
        })
      )

      expect(walletConnection.send).toHaveBeenNthCalledWith(
        7,
        JSON.stringify({
          id: '6',
          jsonrpc: '2.0',
          method: JsonRpcMethod.EthSignTypedDataV0,
          params: []
        })
      )

      expect(walletConnection.send).toHaveBeenNthCalledWith(
        8,
        JSON.stringify({
          id: '7',
          jsonrpc: '2.0',
          method: JsonRpcMethod.EthSignTypedDataV3,
          params: []
        })
      )

      expect(walletConnection.send).toHaveBeenNthCalledWith(
        9,
        JSON.stringify({
          id: '8',
          jsonrpc: '2.0',
          method: JsonRpcMethod.PersonalEcRecover,
          params: []
        })
      )
    })

    it('sends message to remote node if method is not handled by wallet connection', async (): Promise<
      void
    > => {
      const server = new WS('ws://localhost:1234')
      const walletConnection: IConnection = {
        send: jest.fn()
      }
      const jsonRpc = new JsonRpcManager({
        url: 'ws://localhost:1234',
        walletConnection
      })

      await server.connected

      jsonRpc.send('servePinacolada', [])

      await expect(server).toReceiveMessage(
        JSON.stringify({
          id: '0',
          jsonrpc: '2.0',
          method: 'servePinacolada',
          params: []
        })
      )
    })
  })

  describe('onMessage', (): void => {
    it('emits notification if subscription message is provided', (done): void => {
      new WS('ws://localhost:1234')
      const jsonRpc = new JsonRpcManager({
        url: 'ws://localhost:1234'
      })

      const message = JSON.stringify({
        jsonrpc: '2.0',
        method: JsonRpcMethod.EthSubscription,
        params: 'pina colada'
      })

      jsonRpc.on('notification', (data): void => {
        expect(data).toBe('pina colada')
        done()
      })

      jsonRpc.onMessage(message)
    })

    it('rejects when message has an error property', (): void => {
      new WS('ws://localhost:1234')
      const jsonRpc = new JsonRpcManager({
        url: 'ws://localhost:1234'
      })

      expect.assertions(1)

      expect(jsonRpc.send(JsonRpcMethod.EthAccounts, [])).rejects.toBe('Oops')

      const message = JSON.stringify({
        id: '0',
        jsonrpc: '2.0',
        method: JsonRpcMethod.EthAccounts,
        error: 'Oops'
      })
      jsonRpc.onMessage(message)
    })

    it('throws error when a message cannot be parsed', (): void => {
      new WS('ws://localhost:1234')
      const jsonRpc = new JsonRpcManager({
        url: 'ws://localhost:1234'
      })

      expect((): void => jsonRpc.onMessage('')).toThrow(
        new Error('JsonRpcManager: Failed to parse message')
      )
    })

    it('thorws error when a message does not contain jsonrpc property', (): void => {
      new WS('ws://localhost:1234')
      const jsonRpc = new JsonRpcManager({
        url: 'ws://localhost:1234'
      })

      expect((): void => jsonRpc.onMessage('{}')).toThrow(
        new Error(
          'JsonRpcManager: Message does not contain jsonrpc property with a value of 2.0'
        )
      )
    })

    describe('df methods', (): void => {
      it('emits accountsChanged on df_accountsChanged', (done): void => {
        new WS('ws://localhost:1234')
        const jsonRpc = new JsonRpcManager({
          url: 'ws://localhost:1234'
        })

        const message = JSON.stringify({
          id: '0',
          jsonrpc: '2.0',
          method: JsonRpcMethod.DFAccountsChanged,
          result: ['account1', 'account2']
        })

        jsonRpc.on('accountsChanged', (data): void => {
          expect(data).toEqual(['account1', 'account2'])
          done()
        })

        jsonRpc.onMessage(message)
      })

      it('emits close on df_socketClosed', (done): void => {
        new WS('ws://localhost:1234')
        const jsonRpc = new JsonRpcManager({
          url: 'ws://localhost:1234'
        })

        const message = JSON.stringify({
          id: '0',
          jsonrpc: '2.0',
          method: JsonRpcMethod.DFSocketClosed,
          params: [1000, 'terrible wifi']
        })

        jsonRpc.on('close', (code, reason): void => {
          if (typeof code === 'undefined' || reason === '') {
            return
          }
          expect(code).toBe(1000)
          expect(reason).toBe('terrible wifi')
          done()
        })

        jsonRpc.onMessage(message)
      })

      it('emits connect on df_socketConnected', (done): void => {
        new WS('ws://localhost:1234')
        const jsonRpc = new JsonRpcManager({
          url: 'ws://localhost:1234'
        })

        const message = JSON.stringify({
          id: '0',
          jsonrpc: '2.0',
          method: JsonRpcMethod.DFSocketConnected
        })

        jsonRpc.on('connect', (): void => {
          done()
        })

        jsonRpc.onMessage(message)
      })

      it('emits notification on df_socketMessage', (done): void => {
        new WS('ws://localhost:1234')
        const jsonRpc = new JsonRpcManager({
          url: 'ws://localhost:1234'
        })

        const message = JSON.stringify({
          id: '0',
          jsonrpc: '2.0',
          method: JsonRpcMethod.DFSocketMessage,
          params: 'pina colada'
        })

        jsonRpc.on('notification', (result): void => {
          expect(result).toBe('pina colada')
          done()
        })

        jsonRpc.onMessage(message)
      })

      describe('df_changeConnection', (): void => {
        it('closes current connection and open new one with provided url', (): void => {
          const nodeConnection: INodeConnection = {
            close: jest.fn(),
            connect: jest.fn(),
            on: jest.fn(),
            send: jest.fn()
          }
          const jsonRpc = new JsonRpcManager({
            url: 'ws://localhost:1234',
            nodeConnection
          })

          const message = JSON.stringify({
            id: '0',
            jsonrpc: '2.0',
            method: JsonRpcMethod.DFChangeConnection,
            params: ['wss://www.dappface.com']
          })
          jsonRpc.onMessage(message)

          expect(nodeConnection.close).toBeCalledWith()
          expect(nodeConnection.connect).toBeCalledWith(
            'wss://www.dappface.com'
          )
        })

        it('throws error when params is not an array', async (): Promise<
          void
        > => {
          new WS('ws://localhost:1234')
          const jsonRpc = new JsonRpcManager({
            url: 'ws://localhost:1234'
          })

          const message = JSON.stringify({
            id: '0',
            jsonrpc: '2.0',
            method: JsonRpcMethod.DFChangeConnection
          })
          expect((): void => jsonRpc.onMessage(message)).toThrow(
            new Error('JsonRpcManager: Remote node url is missing')
          )
        })

        it('throws error when params is an empty array', async (): Promise<
          void
        > => {
          new WS('ws://localhost:1234')
          const jsonRpc = new JsonRpcManager({
            url: 'ws://localhost:1234'
          })

          const message = JSON.stringify({
            id: '0',
            jsonrpc: '2.0',
            method: JsonRpcMethod.DFChangeConnection,
            params: []
          })
          expect((): void => jsonRpc.onMessage(message)).toThrow(
            new Error('JsonRpcManager: Remote node url is missing')
          )
        })

        it('throws error when remove node url is not a websocket url', (): void => {
          new WS('ws://localhost:1234')
          const jsonRpc = new JsonRpcManager({
            url: 'ws://localhost:1234'
          })

          const message = JSON.stringify({
            id: '0',
            jsonrpc: '2.0',
            method: JsonRpcMethod.DFChangeConnection,
            params: ['']
          })
          expect((): void => jsonRpc.onMessage(message)).toThrow(
            new Error('JsonRpcManager: Invalid remote node url')
          )
        })
      })
    })
  })
})
