import { describe, expect, it } from 'vitest'
import { parseFrontmatter } from '../../../../../src/runtime/server/utils/parseFrontmatter'

describe('parseFrontmatter', () => {
  it('returns untouched markdown when no frontmatter is present', () => {
    const content = '# Hello\n\nworld'

    expect(parseFrontmatter(content)).toEqual({
      frontmatter: {},
      markdown: content,
    })
  })

  it('handles empty frontmatter block', () => {
    const content = '---\n\n---\n# Heading'

    expect(parseFrontmatter(content)).toEqual({
      frontmatter: {},
      markdown: '# Heading',
    })
  })

  it('parses valid frontmatter and returns markdown body', () => {
    const content = '---\ntitle: Test\ndraft: true\n---\n# Heading\n\nText'

    expect(parseFrontmatter(content)).toEqual({
      frontmatter: {
        title: 'Test',
        draft: true,
      },
      markdown: '# Heading\n\nText',
    })
  })

  it('throws a h3 error on invalid frontmatter', () => {
    const content = '---\ntags: [one, two\n---\n# Heading'

    expect(() => parseFrontmatter(content)).toThrowError(/Invalid frontmatter in Markdown file/)
  })
})
