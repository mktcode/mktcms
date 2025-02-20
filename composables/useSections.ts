export async function useSections() {
  const layout = '0';
  const sections = await $fetch('/api/sections/list', { method: 'POST' });

  const sectionComponents = sections.map((section) => defineAsyncComponent(() => import(`~/components/layout/${layout}/${section.component}.vue`)));

  return sectionComponents;
}