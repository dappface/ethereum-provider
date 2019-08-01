import React from 'react'
import { PaddingVertical, Radio, Row } from './atoms'

interface IProps {
  lib: Lib
  setLib: (lib: Lib) => void
}

export const LibSelector = ({ lib, setLib }: IProps) => {
  const onClickLibFactory = (newLib: Lib) => () => {
    setLib(newLib)
  }

  return (
    <Row>
      <PaddingVertical>
        <Radio
          checked={lib === Lib.Ethereum}
          label='Ethereum'
          onClick={onClickLibFactory(Lib.Ethereum)}
        />
      </PaddingVertical>

      <PaddingVertical>
        <Radio
          checked={lib === Lib.Web3}
          label='Web3'
          onClick={onClickLibFactory(Lib.Web3)}
        />
      </PaddingVertical>

      <PaddingVertical>
        <Radio
          checked={lib === Lib.DappFace}
          label='DAPPFACE'
          onClick={onClickLibFactory(Lib.DappFace)}
        />
      </PaddingVertical>
    </Row>
  )
}

export enum Lib {
  Ethereum,
  Web3,
  DappFace
}
