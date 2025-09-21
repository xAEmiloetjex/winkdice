import { reader, Reader } from './public_api.js'

describe('result api', () => {
  it('should export', () => {
    expect(reader(() => { return 1 })).toBeInstanceOf(Reader)
  })
})
