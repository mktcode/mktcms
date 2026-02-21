import { describe, expect, it } from 'vitest'
import { parsedFile } from '../../../../../src/runtime/server/utils/parsedFile'

describe('parsedFile', () => {
  it('parses valid json files', () => {
    const result = parsedFile('/tmp/data.json', '{"name":"mkt","count":2}')

    expect(result).toEqual({ name: 'mkt', count: 2 })
  })

  it('throws on invalid json files', () => {
    expect(() => parsedFile('/tmp/data.json', '{"name":')).toThrowError(/Invalid JSON file/)
  })

  it('parses csv files with semicolon delimiter and skips empty lines', () => {
    const result = parsedFile('/tmp/table.csv', 'name;age\nMax;31\n\nAda;29')

    expect(result).toEqual({
      headers: ['name', 'age'],
      rows: [
        ['Max', '31'],
        ['Ada', '29'],
      ],
    })
  })

  it('throws on malformed csv files', () => {
    expect(() => parsedFile('/tmp/table.csv', 'a;b\n1')).toThrowError(/Invalid CSV file/)
  })

  it('parses markdown with frontmatter and renders html', () => {
    const result = parsedFile('/tmp/post.md', '---\ntitle: Hello\n---\n# Headline') as {
      frontmatter: Record<string, unknown>
      markdown: string
      html: string
    }

    expect(result.frontmatter).toEqual({ title: 'Hello' })
    expect(result.markdown).toBe('# Headline')
    expect(result.html).toContain('<h1>Headline</h1>')
  })

  it('throws on invalid markdown frontmatter', () => {
    expect(() => parsedFile('/tmp/post.md', '---\ntags: [one, two\n---\n# Headline')).toThrowError(/Invalid Markdown file/)
  })

  it('returns untouched input for unsupported extensions or non-string data', () => {
    const file = { id: 1 }

    expect(parsedFile('/tmp/data.bin', file)).toBe(file)
    expect(parsedFile('/tmp/data.json', true)).toBe(true)
  })
})
