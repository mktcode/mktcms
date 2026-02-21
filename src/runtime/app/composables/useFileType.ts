export default function useFileType(path: string) {
  const normalizedPath = path.toLowerCase()

  const isImage = normalizedPath.match(/\.(png|jpg|jpeg|gif|webp)$/) !== null
  const isPdf = normalizedPath.endsWith('.pdf')
  const isMarkdown = normalizedPath.endsWith('.md')
  const isCsv = normalizedPath.endsWith('.csv')
  const isText = normalizedPath.match(/\.(txt|json)$/) !== null

  return {
    isImage,
    isPdf,
    isMarkdown,
    isCsv,
    isText,
  }
}
