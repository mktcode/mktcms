export default function useFileType(path: string) {
  const isImage = path.match(/\.(png|jpg|jpeg|gif|webp)$/i) !== null
  const isPdf = path.endsWith('.pdf')
  const isMarkdown = path.endsWith('.md')
  const isCsv = path.endsWith('.csv')
  const isText = path.match(/\.(txt|json)$/i) !== null

  return {
    isImage,
    isPdf,
    isMarkdown,
    isCsv,
    isText,
  }
}
