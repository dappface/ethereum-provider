import React, { useState } from 'react'
import { Lib, LibSelector } from './lib-selector'
import { Playground } from './playground'

export function App() {
  const [lib, setLib] = useState(Lib.Ethereum)

  return (
    <div>
      <h1>DAPPFACE Provider Example</h1>
      <LibSelector lib={lib} setLib={setLib} />
      <Playground lib={lib} />
    </div>
  )
}
