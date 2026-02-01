export async function useMdContent<T extends Record<string, any>>(path: string) {
  const content = await $fetch<{ frontmatter: T, markdown: string, html: string }>(`/api/content/${path}`)

  return content
}
