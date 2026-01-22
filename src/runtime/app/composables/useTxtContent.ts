export async function useTxtContent(path: string) {
  const content = await $fetch<string>(`/api/content/${path}`)
  
  return content
}
