import { ReactNativeWebSocketNodeConnection } from '..'

describe('ReactNativeWebSocketNodeConnection', (): void => {
  it('posts send message', (): void => {
    window.ReactNativeWebView.postMessage = jest.fn((message: string): void => {
      expect(message).toBe('peanut butter')
    })

    const connection = new ReactNativeWebSocketNodeConnection()
    connection.send('peanut butter')
  })

  it('posts close message', (): void => {
    window.ReactNativeWebView.postMessage = jest.fn((message: string): void => {
      const expectedMsg = JSON.stringify({ method: 'df_closeSocket' })
      expect(message).toBe(expectedMsg)
    })

    const connection = new ReactNativeWebSocketNodeConnection()
    connection.close()
  })

  it('posts connect message', (): void => {
    window.ReactNativeWebView.postMessage = jest.fn((message: string): void => {
      const expectedMsg = JSON.stringify({ method: 'df_connectSocket' })
      expect(message).toBe(expectedMsg)
    })

    const connection = new ReactNativeWebSocketNodeConnection()
    connection.connect()
  })
})
