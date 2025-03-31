export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()
  if (!loggedIn.value && to.path !== '/login' && to.path !== '/' && to.path !== '/datenschutz') {
    return navigateTo('/login')
  }
})