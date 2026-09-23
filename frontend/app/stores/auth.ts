import { defineStore } from 'pinia'
import { authApi, type RegisterInput } from '~/api/auth'
import type { AuthResponse, CurrentUser } from '~/types/api'

/**
 * Who is signed in.
 *
 * The access token is kept in memory only (never in localStorage), so it disappears when the tab
 * is closed. On page load `restoreSession()` asks the API for a new one using the http-only
 * refresh-token cookie, which keeps the user signed in across visits.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<CurrentUser | null>(null)
  const accessToken = ref<string | null>(null)
  const isLoggedIn = computed(() => user.value !== null && accessToken.value !== null)

  function setSession(response: AuthResponse) {
    accessToken.value = response.accessToken
    user.value = response.user
  }

  function clearSession() {
    accessToken.value = null
    user.value = null
  }

  async function login(login: string, password: string) {
    setSession(await authApi.login(login, password))
  }

  async function register(input: RegisterInput) {
    setSession(await authApi.register(input))
  }

  async function logout() {
    try {
      await authApi.logout()
    }
    finally {
      clearSession()
    }
  }

  // Several requests can fail with 401 at the same time; they all wait for the same refresh call.
  let refreshInProgress: Promise<boolean> | null = null

  /** Gets a new access token using the refresh-token cookie. Returns false when the user must log in again. */
  function refreshSession(): Promise<boolean> {
    refreshInProgress ??= authApi.refresh()
      .then((response) => {
        setSession(response)
        return true
      })
      .catch(() => {
        clearSession()
        return false
      })
      .finally(() => {
        refreshInProgress = null
      })

    return refreshInProgress
  }

  let sessionRestored = false

  /** Called once when the app starts (see middleware/auth.global.ts). */
  async function restoreSession() {
    if (sessionRestored) return
    sessionRestored = true
    await refreshSession()
  }

  /** Keeps the header/sidebar in sync after the user edits their profile or avatar. */
  function updateUser(updated: CurrentUser) {
    user.value = updated
  }

  return { user, accessToken, isLoggedIn, login, register, logout, refreshSession, restoreSession, updateUser }
})
