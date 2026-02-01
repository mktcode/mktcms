export async function useMdContents<T extends Record<string, any>>(path: string) {
  const contents = await $fetch<{ key: string, value: { frontmatter: T, markdown: string, html: string } }[]>('/api/content/list', {
    query: {
      path: path,
      type: 'md',
    },
  })

  return contents
}
