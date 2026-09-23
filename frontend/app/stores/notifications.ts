import { defineStore } from 'pinia'
import { notificationsApi } from '~/api/notifications'

/** The unread-notification counter shown as a badge on the heart icon. */
export const useNotificationsStore = defineStore('notifications', () => {
  const unreadCount = ref(0)

  async function refreshUnreadCount() {
    try {
      unreadCount.value = (await notificationsApi.unreadCount()).count
    }
    catch {
      // Not important enough to bother the user; the badge just stays as it was.
    }
  }

  async function markAllRead() {
    unreadCount.value = 0
    await notificationsApi.markAllRead()
  }

  return { unreadCount, refreshUnreadCount, markAllRead }
})
