import React, { useEffect, useState } from 'react'
import testWallet from '../../../test-wallet.json'
import { Button, Padding, PaddingHorizontal } from '../atoms'

export function AccountsChanged() {
  const [result, setResult] = useState<string[]>([])

  function run(): void {
    const message = {
      jsonrpc: '2.0',
      method: 'df_accountsChanged',
      result: testWallet.accounts.slice(0, 1)
    }
    const messageStr = JSON.stringify(message)
    window.ethereum.postMessage(messageStr)
  }

  function onAccountChanged(newAccounts: string[]): void {
    setResult(newAccounts)
  }

  useEffect(() => {
    window.ethereum.on('accountsChanged', onAccountChanged)

    return () => {
      window.ethereum.removeListener('accountsChanged', onAccountChanged)
    }
  })

  return (
    <PaddingHorizontal>
      <h2>df_accountsChanged</h2>
      <Padding>
        <Button onClick={run}>Run</Button>
        {result.length ? <pre>{JSON.stringify(result, null, 2)}</pre> : null}
      </Padding>
    </PaddingHorizontal>
  )
}
