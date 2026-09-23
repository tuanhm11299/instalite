import type { AuthResponse, CurrentUser } from '~/types/api'
import { apiRequest } from './client'

// Sign-in endpoints use plain $fetch instead of apiRequest: they must not trigger the
// "refresh the token and retry" logic (that logic itself calls refresh()).
// The refresh token travels in an http-only cookie that the browser sends automatically.

export interface RegisterInput {
  username: string
  email: string
  password: string
  displayName?: string
}

export const authApi = {
  register: (input: RegisterInput) =>
    $fetch<AuthResponse>('/api/auth/register', { method: 'POST', body: input }),

  /** `login` is a username or an email address. */
  login: (login: string, password: string) =>
    $fetch<AuthResponse>('/api/auth/login', { method: 'POST', body: { login, password } }),

  refresh: () =>
    $fetch<AuthResponse>('/api/auth/refresh', { method: 'POST' }),

  logout: () =>
    $fetch<void>('/api/auth/logout', { method: 'POST' }),

  me: () =>
    apiRequest<CurrentUser>('/api/auth/me'),
}
