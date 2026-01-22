export async function useTxtContents(path: string) {
  const contents = await $fetch<{ key: string, value: string }[]>('/api/content/list', {
    query: {
      path: path,
      type: 'txt',
    },
  })

  return contents
}
