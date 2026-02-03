export async function useImagePaths(path: string = '') {
  const contents = await $fetch<string[]>('/api/content/list', {
    query: {
      path: path,
      type: 'image',
    },
  })

  return contents
}
