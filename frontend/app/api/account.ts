import type { CurrentUser } from '~/types/api'
import { apiRequest } from './client'

export const accountApi = {
  updateProfile: (displayName: string, bio: string) =>
    apiRequest<CurrentUser>('/api/account/profile', { method: 'PUT', body: { displayName, bio } }),

  updateAvatar: (image: File) => {
    const form = new FormData()
    form.append('image', image)
    return apiRequest<CurrentUser>('/api/account/avatar', { method: 'PUT', body: form })
  },

  removeAvatar: () =>
    apiRequest<CurrentUser>('/api/account/avatar', { method: 'DELETE' }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiRequest<void>('/api/account/change-password', { method: 'POST', body: { currentPassword, newPassword } }),
}
