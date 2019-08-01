import { ReactNativeWalletConnection } from '..'

describe('ReactNativeWalletConnection', (): void => {
  it('posts message to React Native', (): void => {
    window.ReactNativeWebView.postMessage = jest.fn()

    const connection = new ReactNativeWalletConnection()
    connection.send('pina colada')
    expect(window.ReactNativeWebView.postMessage).toBeCalledWith('pina colada')
  })
})
