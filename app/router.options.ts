import type { RouterConfig } from '@nuxt/schema'

async function loadData(hostname: string) {
  if (hostname === 'localhost') {
    return null;
  }

  return {
    title: 'My website at ' + hostname,
  }
}

export default {
  routes: async (_routes) => {
    const { hostname } = useRequestURL();

    const data = await loadData(hostname);

    if (data) {
      return [
        {
          name: 'home',
          path: '/',
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
