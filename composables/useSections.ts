export async function useSections(pageSlug: string = '', type: 'static' | 'dynamic' = 'static') {
  const sections = await $fetch('/api/sections/list', { method: 'POST', body: { pageSlug, type } });

  const sectionComponents = sections.map((section) => defineAsyncComponent(() => import(`~/components/website/section/${section.component}.vue`)));

  return sectionComponents;
}