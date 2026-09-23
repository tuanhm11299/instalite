import { useAuthStore } from '~/stores/auth'

/**
 * Runs before every page change ("global" route middleware).
 *  - Pages are private by default: signed-out visitors are sent to /login.
 *  - Pages that set `definePageMeta({ public: true })` (login, register) are for signed-out visitors only.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  await auth.restoreSession()

  const isPublicPage = to.meta.public === true

  if (!auth.isLoggedIn && !isPublicPage) {
    return navigateTo({ path: '/login', query: to.fullPath === '/' ? {} : { redirect: to.fullPath } })
  }

  if (auth.isLoggedIn && isPublicPage) {
    return navigateTo('/')
  }
})
