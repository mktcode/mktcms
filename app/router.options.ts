import type { RouterConfig } from '@nuxt/schema'
import { loadWebsite } from '~/server/utils/loadWebsite';

export default {
  routes: async (_routes) => {
    const { hostname, pathname } = useRequestURL();

    const website = await loadWebsite(hostname, pathname);

    if (website) {
      return [
        {
          name: 'landingpage',
          path: pathname,
          component: () => import('~/components/Landingpage.vue'),
          props: { website },
          meta: {
            layout: 'landingpage',
          }
        },
      ];
    }

    return _routes;
  },
} satisfies RouterConfig
