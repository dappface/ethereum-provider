export interface IConnection {
  send(message: string): void
}

export interface ITestWallet {
  accounts: string[]
}
