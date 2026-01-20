import { createError } from 'h3'
import { parse } from 'yaml'

export function parseFrontmatter(content: string) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n?/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { frontmatter: {}, markdown: content }
  }

  const frontmatterRaw = match[1]
  const markdown = content.slice(match[0].length)

  if (!frontmatterRaw) {
    return { frontmatter: {}, markdown }
  }

  let frontmatter: Record<string, any> = {}
  try {
    frontmatter = parse(frontmatterRaw)
  }
  catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Invalid frontmatter in Markdown file',
    })
  }

  return { frontmatter, markdown }
}
