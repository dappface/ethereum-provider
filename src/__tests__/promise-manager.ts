import { PromiseManager } from '../promise-manager'

describe('PromiseManager', (): void => {
  describe('resolve', (): void => {
    it('resolves resgisterd promise', (): Promise<any> => {
      const promiseManager = new PromiseManager()
      const promise = promiseManager.register('random-id')
      promiseManager.resolve('random-id', 'peanut butter')

      return expect(promise).resolves.toBe('peanut butter')
    })

    it('throws error if id is not exist', (): void => {
      function resolveUnregisteredId(): void {
        const promiseManager = new PromiseManager()
        promiseManager.resolve('random-id', 'peanut butter')
      }

      expect(resolveUnregisteredId).toThrowError(
        new Error('PromiseManager: Promise ID does not exist')
      )
    })
  })

  describe('reject', (): void => {
    it('rejects resgisterd promise with Error', (): Promise<any> => {
      const promiseManager = new PromiseManager()
      const promise = promiseManager.register('random-id')
      promiseManager.reject('random-id', new Error('peanut butter'))

      return expect(promise).rejects.toEqual(new Error('peanut butter'))
    })

    it('throws error if id is not exist', (): void => {
      function rejectUnregisteredId(): void {
        const promiseManager = new PromiseManager()
        promiseManager.reject('random-id', new Error('peanut butter'))
      }

      expect(rejectUnregisteredId).toThrowError(
        new Error('PromiseManager: Promise ID does not exist')
      )
    })
  })
})
