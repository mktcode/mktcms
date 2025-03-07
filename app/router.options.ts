import type { RouterConfig } from '@nuxt/schema'
import { loadData } from '~/server/utils/loadData';

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
