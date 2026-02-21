import { describe, expect, it } from 'vitest'
import { toNodeBuffer } from '../../../../../src/runtime/server/utils/toNodeBuffer'

describe('toNodeBuffer', () => {
  it('returns the same instance when input is already a Buffer', () => {
    const input = Buffer.from('abc')
    const result = toNodeBuffer(input)

    expect(result).toBe(input)
  })

  it('converts string to Buffer', () => {
    const result = toNodeBuffer('hello')

    expect(Buffer.isBuffer(result)).toBe(true)
    expect(result.toString()).toBe('hello')
  })

  it('converts ArrayBuffer to Buffer', () => {
    const arrayBuffer = Uint8Array.from([1, 2, 3]).buffer
    const result = toNodeBuffer(arrayBuffer)

    expect([...result]).toEqual([1, 2, 3])
  })

  it('converts typed arrays preserving byte offset and length', () => {
    const view = Uint8Array.from([9, 8, 7, 6]).subarray(1, 3)
    const result = toNodeBuffer(view)

    expect([...result]).toEqual([8, 7])
  })

  it('throws a h3 error for invalid input', () => {
    expect(() => toNodeBuffer(123)).toThrowError(/Invalid binary file/)
  })
})
