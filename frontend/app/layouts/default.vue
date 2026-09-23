<script setup lang="ts">
import { useNotificationsStore } from '~/stores/notifications'

/**
 * Layout for every signed-in page.
 *   Phone  (< 768px):  top bar + content + bottom tab bar
 *   Tablet (≥ 768px):  narrow icon sidebar + content
 *   Desktop (≥ 1280px): wide sidebar with labels + content
 */
const notifications = useNotificationsStore()
const route = useRoute()

// Keep the notification badge fresh: on start, on every page change and every minute.
const REFRESH_INTERVAL_MS = 60_000
let refreshTimer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  notifications.refreshUnreadCount()
  refreshTimer = setInterval(notifications.refreshUnreadCount, REFRESH_INTERVAL_MS)
})
onBeforeUnmount(() => clearInterval(refreshTimer))
watch(() => route.path, () => notifications.refreshUnreadCount())
</script>

<template>
  <div class="min-h-dvh bg-default">
    <AppSidebar />
    <AppMobileHeader />

    <main class="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:ps-[72px] md:pb-0 xl:ps-60">
      <slot />
    </main>

    <AppBottomNav />

    <!-- Dialogs that can be opened from anywhere -->
    <CreatePostModal />
    <StoryViewer />
  </div>
</template>
