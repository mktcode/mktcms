import { isCsvPath, isImagePath, isMarkdownPath, isPdfPath, isTextPath } from '../../shared/contentFiles'

export default function useFileType(path: string) {
  const isImage = isImagePath(path)
  const isPdf = isPdfPath(path)
  const isMarkdown = isMarkdownPath(path)
  const isCsv = isCsvPath(path)
  const isText = isTextPath(path)

  return {
    isImage,
    isPdf,
    isMarkdown,
    isCsv,
    isText,
  }
}
