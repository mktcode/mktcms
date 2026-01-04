export default async function useContent(slug: string) {
  const { data: content, refresh } = await useFetch(`/api/content/${slug}`);

  if (!content.value) {
    throw new Error(`Content with slug "${slug}" not found.`);
  }

  return {
    content,
    refresh,
  };
}