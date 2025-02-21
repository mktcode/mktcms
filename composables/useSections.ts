export async function useSections() {
  const sections = await $fetch('/api/sections/list', { method: 'POST' });

  const sectionComponents = sections.map((section) => defineAsyncComponent(() => import(`~/components/website/section/${section.component}.vue`)));

  return sectionComponents;
}