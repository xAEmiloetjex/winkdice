import { fail, ok } from '../result.factory.js'
import { IResult } from '../result.interface.js'
import { resultToPromise } from './result-to-promise.js'

describe('resultToPromise', () => {
  it('should map', () => {
    const sut = new Promise<IResult<string, Error>>(resolve => resolve(ok('test')))

    return sut
      .then(resultToPromise)
      .then(result => expect(result).toEqual('test'))
      .catch(() => expect(false).toBe(true))
  })

  it('should catch w/ fail result', () => {
    const sut = new Promise<IResult<string, Error>>(resolve => resolve(fail(new Error('test error'))))

    return sut
      .then(resultToPromise)
      .then(() => expect(false).toBe(true))
      .catch(error => expect(error).toEqual(new Error('test error')))
  })

})
