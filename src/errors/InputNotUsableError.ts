export class InputNotUsableError extends Error {
  public code: number
  public faultyInput: any
  constructor(message?: string, faultyInput?: any) {
    super(message)
    this.name = this.constructor.name
    this.code = 406
    this.faultyInput = faultyInput
    Object.setPrototypeOf(this, new.target.prototype)
  }
}