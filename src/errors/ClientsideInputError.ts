export class ClientsideInputError extends Error {
  public code: number
  constructor(message?: string) {
    super(message)
    this.name = this.constructor.name
    this.code = 400
    Object.setPrototypeOf(this, new.target.prototype)
  }
}