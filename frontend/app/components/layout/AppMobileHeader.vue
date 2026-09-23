<script setup lang="ts">
import { useNotificationsStore } from '~/stores/notifications'

/** Top bar on phones only: logo, notifications (heart) and the "More" menu. */
const notifications = useNotificationsStore()
const { moreMenuItems, isActive } = useNavigation()
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-default bg-default/95 px-4 backdrop-blur md:hidden"
  >
    <AppLogo />

    <div class="flex items-center gap-1">
      <UButton
        to="/notifications"
        color="neutral"
        variant="ghost"
        aria-label="Notifications"
        class="relative"
      >
        <UChip :show="notifications.unreadCount > 0" :text="notifications.unreadCount" size="3xl" color="error">
          <UIcon :name="isActive('/notifications') ? 'i-ph-heart-fill' : 'i-ph-heart'" class="size-7" />
        </UChip>
      </UButton>

      <UDropdownMenu :items="moreMenuItems" :content="{ align: 'end' }">
        <UButton icon="i-ph-list" color="neutral" variant="ghost" size="lg" aria-label="More" />
      </UDropdownMenu>
    </div>
  </header>
</template>
