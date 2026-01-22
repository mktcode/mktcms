export async function useCsvContent(path: string) {
  const content = await $fetch<{ headers: string[], rows: string[][] }>(`/api/content/${path}`)

  return content
}
