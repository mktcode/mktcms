export async function useContent(categories: number[], limit: number = 10) {
  const content = await $fetch('/api/content/list', { method: 'POST', body: { categories, limit } });

  return { content };
}