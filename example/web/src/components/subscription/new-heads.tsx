import React, { useEffect, useRef, useState } from 'react'
import { Button, Column, Padding, PaddingHorizontal } from '../atoms'

export function EthSubscribeNewHeads() {
  const [subscriptionId, setSubscriptionId] = useState<string | undefined>(
    undefined
  )
  const [result, setResult] = useState(undefined)
  const [errorMessage, setErrorMessage] = useState('')

  function onNotificationFactory(id: string) {
    return (newResult: any) => {
      if (newResult.subscription !== id) {
        return
      }

      if (newResult.result instanceof Error) {
        setErrorMessage(newResult.result)
        return
      }

      setResult(newResult.result)
    }
  }

  const notificationListener = useRef<(result: any) => void>()

  async function subscribe(): Promise<void> {
    const id = await window.ethereum.send('eth_subscribe', ['newHeads'])
    setSubscriptionId(id)
    notificationListener.current = onNotificationFactory(id)
    window.ethereum.on('notification', notificationListener.current)
  }

  async function unsubscribe(): Promise<void> {
    if (!subscriptionId) {
      return
    }
    await window.ethereum.send('eth_unsubscribe', [subscriptionId])
    if (notificationListener.current) {
      window.ethereum.removeListener(
        'notification',
        notificationListener.current
      )
    }
    notificationListener.current = undefined
    setSubscriptionId(undefined)
    setResult(undefined)
  }

  useEffect(
    () => () => {
      if (!subscriptionId) {
        return
      }
      window.ethereum.send('eth_unsubscribe', [subscriptionId])
    },
    [subscriptionId]
  )

  return (
    <PaddingHorizontal>
      <h2>eth_subscribe [newHeads]</h2>
      <Padding>
        <Column>
          {subscriptionId ? (
            <Button onClick={unsubscribe}>Unsubscribe</Button>
          ) : (
            <Button onClick={subscribe}>Subscribe</Button>
          )}
          {errorMessage ? <div>{errorMessage}</div> : null}
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </Column>
      </Padding>
    </PaddingHorizontal>
  )
}

export function NewBlockHeaders() {
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [result, setResult] = useState<any>()
  const [errorMessage, setErrorMessage] = useState('')

  const subscription = useRef<any>()

  function onData(data: any): void {
    setResult(data)
  }

  function onError(error: Error): void {
    setErrorMessage(error.message)
  }

  function subscribe(): void {
    setIsSubscribing(true)
    subscription.current = window.web3.eth
      .subscribe('newBlockHeaders')
      .on('data', onData)
      .on('error', onError)
  }

  function unsubscribe(): void {
    if (!subscription.current) {
      return
    }

    setIsSubscribing(false)
    subscription.current.unsubscribe()
    subscription.current = undefined
    setResult(undefined)
  }

  useEffect(
    () => () => {
      if (!subscription.current) {
        return
      }
      subscription.current.unsubscribe()
    },
    []
  )

  return (
    <PaddingHorizontal>
      <h2>subscribe [newBlockHeader]</h2>
      <Padding>
        {isSubscribing ? (
          <Button onClick={unsubscribe}>Unsubscribe</Button>
        ) : (
          <Button onClick={subscribe}>Subscribe</Button>
        )}
        {errorMessage ? <div>{errorMessage}</div> : null}
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </Padding>
    </PaddingHorizontal>
  )
}
