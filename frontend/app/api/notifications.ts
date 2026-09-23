import type { AppNotification, CursorPage } from '~/types/api'
import { apiRequest } from './client'

export const notificationsApi = {
  list: (cursor: string | null) =>
    apiRequest<CursorPage<AppNotification>>('/api/notifications', { query: { cursor, pageSize: 20 } }),

  unreadCount: () =>
    apiRequest<{ count: number }>('/api/notifications/unread-count'),

  markAllRead: () =>
    apiRequest<void>('/api/notifications/mark-read', { method: 'POST' }),
}
