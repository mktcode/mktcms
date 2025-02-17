export async function useContent(category: string = 'all', limit: number = 10) {
  const content = await $fetch('/api/content/list', { method: 'POST', body: { category, limit } });

  return { content };
}