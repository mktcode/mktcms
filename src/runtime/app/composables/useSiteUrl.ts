import { useRuntimeConfig } from '#app'

export function useSiteUrl() {
  const { public: { mktcms: { siteUrl } } } = useRuntimeConfig()
  
  return siteUrl
}
