import { useRoute } from '#app'
import useFileType from './useFileType'

export default function usePathParam() {
  const path = useRoute().params.path as string || ''
  const pathParts = path.split(':').filter(part => part.trim() !== '')

  const { isImage, isPdf, isMarkdown, isCsv, isText } = useFileType(path)

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
