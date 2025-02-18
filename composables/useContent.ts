import { type ContentWithCategories } from "~/types";

export async function useContent(categories: number[], limit: number = 10) {
  const content = await $fetch('/api/content/list', { method: 'POST', body: { categories, limit } });

  return content;
}

export async function useContentById(id: number | string) {
  const content = await $fetch<ContentWithCategories | null>(`/api/content/${id}`);

  return content;
}