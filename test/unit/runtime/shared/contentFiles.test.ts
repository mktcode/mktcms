import { describe, expect, it } from 'vitest'
import {
  CONTENT_UPLOAD_EXTENSIONS,
  DEFAULT_MAX_UPLOAD_BYTES,
  IMAGE_EXTENSIONS,
  PDF_EXTENSIONS,
  hasAllowedExtension,
  isCsvPath,
  isImagePath,
  isJsonPath,
  isMarkdownPath,
  isPdfPath,
  isTextPath,
  toAcceptAttribute,
  toFileExtension,
} from '../../../../src/runtime/shared/contentFiles'

describe('contentFiles', () => {
  it('extracts lower-cased file extensions', () => {
    expect(toFileExtension('Folder/My.File.PDF')).toBe('.pdf')
    expect(toFileExtension('no-extension')).toBe('')
  })

  it('classifies file types via shared helpers', () => {
    expect(isImagePath('photo.JPEG')).toBe(true)
    expect(isPdfPath('doc.pdf')).toBe(true)
    expect(isMarkdownPath('entry.MD')).toBe(true)
    expect(isCsvPath('table.csv')).toBe(true)
    expect(isJsonPath('config.json')).toBe(true)
    expect(isTextPath('readme.txt')).toBe(true)
  })

  it('checks allowed extensions consistently', () => {
    expect(hasAllowedExtension('post.md', CONTENT_UPLOAD_EXTENSIONS)).toBe(true)
    expect(hasAllowedExtension('archive.zip', CONTENT_UPLOAD_EXTENSIONS)).toBe(false)
  })

  it('builds file input accept attributes', () => {
    expect(toAcceptAttribute(PDF_EXTENSIONS)).toBe('.pdf')
    expect(toAcceptAttribute(IMAGE_EXTENSIONS)).toBe('.jpg,.jpeg,.png,.gif,.webp')
  })

  it('exposes 50mb default upload limit', () => {
    expect(DEFAULT_MAX_UPLOAD_BYTES).toBe(50 * 1024 * 1024)
  })
})
