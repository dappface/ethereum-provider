[![CircleCI][circleci-svg]][circleci-link]
[![codecov][codecov-svg]][codecov-link]

<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/147px-Ethereum_logo_2014.svg.png">
  <h1>DAPPFACE Ethereum Provider</h1>
  <p>EIP-1193 compatible Ethereum provider which is injectable for both Web and React Native WebView.</p>
</div>

<h2 align="center">Install</h2>

```bash
  npm i -D @dappface/ethereum-provider
```

<h2 align="center">Usage</h2>

```typescript
import { EthereumProvider } from '@dappface/ethereum-provider'
import Web3 from 'web3.js' // optional

const ethereum = new EthereumProvider({
  url: 'wss://your-remote-node-url'
})

window.ethereum = ethereum

// optionally wrap with your favorite ethereum util library
const web3 = new Web3(ethereum)
```

<h2 align="center">Advanced Usage</h2>

### Inject in React Native WebView

```typescript
// TODO
```

### Hook wallet implemented in React Native

```typescript
// TODO
```

### Create custom wallet connection

```typescript
// TODO
```


### Create custom node connection

```typescript
// TODO
```

[circleci-svg]: https://circleci.com/gh/dappface/ethereum-provider.svg?style=svg
[circleci-link]: https://circleci.com/gh/dappface/ethereum-provider
[codecov-svg]: https://codecov.io/gh/dappface/ethereum-provider/branch/master/graph/badge.svg
[codecov-link]: https://codecov.io/gh/dappface/ethereum-provider
