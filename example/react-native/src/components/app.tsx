import code from 'dappface-provider-web-example/dist/index.json'
import React from 'react'
import { WebView } from 'react-native-webview'
import styled from 'styled-components/native'

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
  return (
    <Container>
      <StyledWebView
        originWhitelist={['*']}
        source={{ html }}
        onMessage={console.log}
        injectedJavaScript={code['index.native.js']}
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
