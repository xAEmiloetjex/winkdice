import { Logger } from './public_api.js'

describe('logger api', () => {
  it('should export', () => {
    expect(new Logger([], 'valie')).toBeInstanceOf(Logger)
  })
})
