import { describe, expect, it } from 'vitest'
import useFileType from '../../../../../src/runtime/app/composables/useFileType'

describe('useFileType', () => {
  it('classifies known extensions correctly', () => {
    expect(useFileType('/a/image.PNG')).toEqual({
      isImage: true,
      isPdf: false,
      isMarkdown: false,
      isCsv: false,
      isText: false,
    })

    expect(useFileType('/a/file.pdf')).toEqual({
      isImage: false,
      isPdf: true,
      isMarkdown: false,
      isCsv: false,
      isText: false,
    })

    expect(useFileType('/a/post.md')).toEqual({
      isImage: false,
      isPdf: false,
      isMarkdown: true,
      isCsv: false,
      isText: false,
    })

    expect(useFileType('/a/data.csv')).toEqual({
      isImage: false,
      isPdf: false,
      isMarkdown: false,
      isCsv: true,
      isText: false,
    })

    expect(useFileType('/a/config.JSON')).toEqual({
      isImage: false,
      isPdf: false,
      isMarkdown: false,
      isCsv: false,
      isText: true,
    })
  })

  it('returns all false for unknown extensions', () => {
    expect(useFileType('/a/archive.zip')).toEqual({
      isImage: false,
      isPdf: false,
      isMarkdown: false,
      isCsv: false,
      isText: false,
    })
  })

  it('supports case-insensitive extensions for all known types', () => {
    expect(useFileType('/a/file.PDF').isPdf).toBe(true)
    expect(useFileType('/a/file.MD').isMarkdown).toBe(true)
    expect(useFileType('/a/file.CSV').isCsv).toBe(true)

    expect(useFileType('/a/file.JPEG').isImage).toBe(true)
    expect(useFileType('/a/file.TXT').isText).toBe(true)
  })
})
