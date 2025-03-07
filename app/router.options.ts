import type { RouterConfig } from '@nuxt/schema'

async function loadData(hostname: string, pathname: string) {
  if (hostname === 'localhost') {
    return null;
  }

  return {
    title: 'My website at ' + hostname + pathname,
  }
}

export default {
  routes: async (_routes) => {
    const { hostname, pathname } = useRequestURL();

    const data = await loadData(hostname, pathname);

    if (data) {
      return [
        {
          name: 'landingpage',
          path: pathname,
          component: () => import('~/components/Landingpage.vue'),
          props: data,
          meta: {
            layout: 'landingpage',
          }
        },
      ];
    }

    return _routes;
  },
} satisfies RouterConfig
