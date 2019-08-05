import { JsonRpcMethod } from '@dappface/ethereum-provider'
import React, { useRef } from 'react'
import { INFURA_PROJECT_ID } from 'react-native-dotenv'
import { WebView } from 'react-native-webview'
import { WebViewMessageEvent } from 'react-native-webview/lib/WebViewTypes'
import styled from 'styled-components/native'

// @ts-ignore
import code from '../../dist/index.json'

// TODO
// - establish websocket connection to a node
// - handle connect socket
// - handle close socket
// - handle send message
// - emit socket connected
// - emit socket closed
// - emit socket message
// - emit accounts changed

// - eth_accounts
// - eth_getBalance
// - eth_subscribe [newHead]
// - df_changeConnection
// - df_accountsChanged

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>DAPPFACE Provider Example</title>
</head>
<body>
  <div id="root"></div>
</html>
`

export function App() {
  function handleMessage(e: WebViewMessageEvent): void {
    console.log(e.nativeEvent.data)
  }

  const ref = useRef<WebView | null>(null)

  function handleLoad() {
    const ws = new WebSocket(
      `wss://rinkeby.infura.io/ws/v3/${INFURA_PROJECT_ID}`
    )
    ws.onopen = () => {
      if (!ref.current) {
        return
      }

      const msg = JSON.stringify({
        jsonrpc: '2.0',
        method: JsonRpcMethod.DFSocketConnected
      })

      ref.current.injectJavaScript(`
        window.ethereum.on('connect', () => alert('connected'));
        window.ethereum.postMessage('${msg}');
        true;
      `)
    }
  }

  return (
    <Container>
      <StyledWebView
        ref={ref}
        originWhitelist={['*']}
        source={{ html }}
        onMessage={handleMessage}
        onLoad={handleLoad}
        injectedJavaScript={code['injectable.js']}
      />
    </Container>
  )
}

const Container = styled.SafeAreaView`
  flex: 1;
`

const StyledWebView = styled(WebView)`
  flex: 1;
`
