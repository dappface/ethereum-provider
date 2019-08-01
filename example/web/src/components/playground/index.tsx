import React from 'react'
import { Lib } from '../lib-selector'
import { DappFacePlayground } from './dappface'
import { EthereumPlayground } from './ethereum'
import { Web3Playground } from './web3'

interface IProps {
  lib: Lib
}

export function Playground({ lib }: IProps) {
  switch (lib) {
    case Lib.Ethereum:
      return <EthereumPlayground />
    case Lib.Web3:
      return <Web3Playground />
    case Lib.DappFace:
      return <DappFacePlayground />
  }
}
