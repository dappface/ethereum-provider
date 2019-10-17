import { ITestWallet } from '../type'

let testWallet: ITestWallet

export const ctx: Worker = self as any

const createMessage = (data: {
  id: string
  result?: any
  error?: any
}): string => JSON.stringify({ jsonrpc: '2.0', ...data })

ctx.onmessage = (e: MessageEvent): void => {
  const data = JSON.parse(e.data)

  console.log('Worker: Received message:', data)

  switch (data.method) {
    case 'eth_accounts': {
      const msg = createMessage({
        id: data.id,
        result: testWallet.accounts
      })
      ctx.postMessage(msg)
      return
    }
    case 'eth_coinbase': {
      const msg = createMessage({
        id: data.id,
        result: testWallet.accounts[0] || null
      })
      ctx.postMessage(msg)
      return
    }
    case 'eth_sign':
    case 'eth_signTypedData':
    case 'eth_signTypedData_v0':
    case 'eth_signTypedData_v3':
    case 'personal_sign':
    case 'personal_ecRecover':
      console.log(`[TODO]: ${data.method}`)

    // For mocking
    case 'df_initTestWallet':
      testWallet = data.params[0]
      return
    default:
      throw new Error('Worker: unkown message type')
  }
}
