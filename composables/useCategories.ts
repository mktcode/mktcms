export async function useCategories() {
  const { data, refresh } = await useFetch('/api/categories/list', { method: 'POST' });

  return { categories: data, refreshCategories: refresh };
}