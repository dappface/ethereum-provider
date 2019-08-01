import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Size } from '../../const'
import { Button, Column, Padding, PaddingHorizontal, Row } from '../atoms'

export function ChangeConnection() {
  const [url, setUrl] = useState('')
  const chainId = useChainChaingedListener()
  const networkId = useNetworkChaingedListener()

  function onChangeUrl(e: React.ChangeEvent<HTMLInputElement>): void {
    setUrl(e.target.value)
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()

    window.ethereum.postMessage(
      JSON.stringify({
        jsonrpc: '2.0',
        method: 'df_changeConnection',
        params: [url]
      })
    )
  }

  return (
    <PaddingHorizontal>
      <h2>df_changeConnection</h2>
      <Padding>
        <Column>
          <Row>
            <form onSubmit={onSubmit}>
              <StyledInput
                value={url}
                onChange={onChangeUrl}
                placeholder='wss://ropsten.infura.io/ws/v3/YOUR-PROJECT-ID'
              />
              <Button type='submit'>Run</Button>
            </form>
          </Row>

          {chainId ? <div>chainId: {chainId}</div> : null}
          {networkId ? <div>networkId: {networkId}</div> : null}
        </Column>
      </Padding>
    </PaddingHorizontal>
  )
}

const StyledInput = styled.input`
  width: 400px;
  margin-right: ${Size.Margin8}px;
`

function useChainChaingedListener(): string {
  const [chainId, setChainId] = useState('')

  const onChainChanged = (newChainId: string): void => {
    setChainId(newChainId)
  }

  useEffect(() => {
    window.ethereum.on('chainChanged', onChainChanged)
    return () => {
      window.ethereum.removeListener('chainChanged', onChainChanged)
    }
  }, [])

  return chainId
}

function useNetworkChaingedListener(): string {
  const [networkId, setNetworkId] = useState('')

  const onNetworkChanged = (newNetworkId: string): void => {
    setNetworkId(newNetworkId)
  }

  useEffect(() => {
    window.ethereum.on('networkChanged', onNetworkChanged)

    return () => {
      window.ethereum.removeListener('networkChanged', onNetworkChanged)
    }
  }, [])

  return networkId
}
