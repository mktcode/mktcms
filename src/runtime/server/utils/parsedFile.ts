import { createError } from 'h3'
import { parse } from 'csv-parse/sync'
import { marked } from 'marked'
import { parseFrontmatter } from './parseFrontmatter'

export function parsedFile(fullPath: string, file: string | number | boolean | object) {
  if (fullPath.endsWith('.json') && typeof file === 'string') {
    try {
      return JSON.parse(file)
    }
    catch {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid JSON file',
      })
    }
  }

  if (fullPath.endsWith('.csv') && typeof file === 'string') {
    try {
      const table = parse(file, {
        skip_empty_lines: true,
        delimiter: ';',
      })

      const headers = Array.isArray(table[0]) ? table[0].map(cell => String(cell ?? '')) : []

      const rows = table.slice(1)

      return { headers, rows }
    }
    catch {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid CSV file',
      })
    }
  }

  if (fullPath.endsWith('.md') && typeof file === 'string') {
    try {
      const markdownItem = parseFrontmatter(file)
      return {
        ...markdownItem,
        html: marked.parse(markdownItem.markdown),
      }
    }
    catch {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid Markdown file',
      })
    }
  }

  return file
}