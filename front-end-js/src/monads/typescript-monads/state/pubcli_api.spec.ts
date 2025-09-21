import { State } from './public_api.js'

describe('state api', () => {
  it('should export', () => {
    expect(new State(a => [a, ''])).toBeInstanceOf(State)
  })
})
