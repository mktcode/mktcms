import { useRoute } from '#app'

export default function usePathParam() {
  const path = useRoute().params.path as string || ''
  const pathParts = path.split(':').filter(part => part.trim() !== '')

  const isImage = path.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i) !== null
  const isPdf = path.endsWith('.pdf')
  const isMarkdown = path.endsWith('.md')
  const isCsv = path.endsWith('.csv')
  const isText = path.match(/\.(txt|json)$/i) !== null

  return {
    path,
    pathParts,
    isImage,
    isPdf,
    isMarkdown,
    isCsv,
    isText,
  }
}
