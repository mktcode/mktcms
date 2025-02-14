export async function useContent(category: string = 'all', limit: number = 10) {
  const { data: content } = await useFetch('/api/posts/list', { method: 'POST', body: { category, limit } });

  return { content };
}