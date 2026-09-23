import type { Story, StoryTrayItem, UserListItem } from '~/types/api'
import { apiRequest } from './client'

export const storiesApi = {
  tray: () =>
    apiRequest<StoryTrayItem[]>('/api/stories'),

  create: (image: File) => {
    const form = new FormData()
    form.append('image', image)
    return apiRequest<Story>('/api/stories', { method: 'POST', body: form })
  },

  remove: (storyId: string) =>
    apiRequest<void>(`/api/stories/${storyId}`, { method: 'DELETE' }),

  markViewed: (storyId: string) =>
    apiRequest<void>(`/api/stories/${storyId}/view`, { method: 'POST' }),

  viewers: (storyId: string) =>
    apiRequest<UserListItem[]>(`/api/stories/${storyId}/viewers`),
}
