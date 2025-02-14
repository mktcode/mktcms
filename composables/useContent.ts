export async function useContent(category: string = 'all', limit: number = 10) {
  const content = await $fetch('/api/posts/list', { method: 'POST', body: { category, limit } });

  return { content };
}