export async function useSections() {
  const layout = '0';
  const sections = ['Header', 'About', 'Prices', 'Events', 'Contact', 'Footer'];

  const sectionComponents = sections.map((section) => defineAsyncComponent(() => import(`~/components/layout/${layout}/${section}.vue`)));

  return sectionComponents;
}