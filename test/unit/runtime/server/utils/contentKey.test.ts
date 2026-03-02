import { describe, expect, it } from 'vitest'
import { normalizeContentKey, normalizeContentPrefix } from '../../../../../src/runtime/server/utils/contentKey'

describe('contentKey', () => {
  describe('normalizeContentKey', () => {
    it('normalizes slash and backslash separators to colon format', () => {
      expect(normalizeContentKey('blog/posts/file.md')).toBe('blog:posts:file.md')
      expect(normalizeContentKey('blog\\posts\\file.md')).toBe('blog:posts:file.md')
      expect(normalizeContentKey('blog/posts\\file.md')).toBe('blog:posts:file.md')
    })

    it('decodes encoded paths and normalizes separators', () => {
      expect(normalizeContentKey('blog%2Fposts%2Ffile.md')).toBe('blog:posts:file.md')
      expect(normalizeContentKey('dir%5Csub%5Cfile.txt')).toBe('dir:sub:file.txt')
    })

    it('allows whitespace in directory and file names', () => {
      expect(normalizeContentKey('About us.md')).toBe('About us.md')
      expect(normalizeContentKey('Company Pages/About us.md')).toBe('Company Pages:About us.md')
      expect(normalizeContentKey('Company%20Pages/About%20us.md')).toBe('Company Pages:About us.md')
    })

    it('rejects invalid keys', () => {
      const invalidInputs = [
        '',
        '   ',
        '/',
        '\\',
        '/root/file.md',
        'C:/temp/file.md',
        'blog::file.md',
        'blog:..:file.md',
        '../file.md',
        'blog/../file.md',
        '%2E%2E%2Ffile.md',
        'blog\u0000file.md',
      ]

      for (const input of invalidInputs) {
        expect(() => normalizeContentKey(input)).toThrowError(/Invalid content path/)
      }
    })
  })

  describe('normalizeContentPrefix', () => {
    it('returns empty prefix for missing input', () => {
      expect(normalizeContentPrefix()).toBe('')
      expect(normalizeContentPrefix('')).toBe('')
      expect(normalizeContentPrefix('   ')).toBe('')
    })

    it('normalizes valid prefixes', () => {
      expect(normalizeContentPrefix('blog/posts')).toBe('blog:posts')
      expect(normalizeContentPrefix('blog%2Fposts')).toBe('blog:posts')
    })

    it('rejects invalid prefixes', () => {
      const invalidPrefixes = ['/blog', '../blog', '%2E%2E%2Fblog', 'blog::posts']

      for (const input of invalidPrefixes) {
        expect(() => normalizeContentPrefix(input)).toThrowError(/Invalid content path/)
      }
    })
  })
})
