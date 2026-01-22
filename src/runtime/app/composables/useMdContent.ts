export async function useMdContent(path: string) {
  const content = await $fetch<{ frontmatter: Record<string, any>, markdown: string, html: string }>(`/api/content/${path}`)

  return content
}
