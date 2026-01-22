export async function useMdContents(path: string) {
  const contents = await $fetch<{ key: string, value: { frontmatter: Record<string, any>, markdown: string, html: string } }[]>('/api/content/list', {
    query: {
      path: path,
      type: 'md',
    },
  })

  return contents
}
