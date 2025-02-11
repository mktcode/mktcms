export default defineNuxtRouteMiddleware(async (to) => {
  if (!import.meta.server && !to.fullPath.startsWith('/mktcms')) {
    await $fetch('/api/stats/route', {
      method: 'POST',
      body: {
        route: to.fullPath,
      },
    })
  }
})
