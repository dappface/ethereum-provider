export interface IPromiseManager {
  register(id: string): Promise<any>
  resolve(id: string, data: any): void
  reject(id: string, data: any): void
}

export class PromiseManager implements IPromiseManager {
  private promiseList: IPromiseList = {}

  public register(id: string): Promise<any> {
    return new Promise((resolve, reject): void => {
      this.promiseList[id] = { id, resolve, reject }
    })
  }

  public resolve(id: string, data: any): void {
    const result = this.getById(id)
    if (result instanceof Error) {
      throw result
    }

    result.resolve(data)
    this.remove(id)
  }

  public reject(id: string, data: Error): void {
    const result = this.getById(id)
    if (result instanceof Error) {
      throw result
    }

    result.reject(data)
    this.remove(id)
  }

  private getById(id: string): IPromiseItem | Error {
    const promise = this.promiseList[id]
    if (!promise) {
      return new Error('PromiseManager: Promise ID does not exist')
    }

    return promise
  }

  private remove(id: string): void {
    delete this.promiseList[id]
  }
}

interface IPromiseList {
  [key: string]: IPromiseItem
}

interface IPromiseItem {
  id: string
  resolve: (...args: any[]) => void
  reject: (error: Error) => void
}
