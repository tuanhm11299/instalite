<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

/** Bottom tab bar on phones only. Leaves room for the iPhone home indicator (safe-area inset). */
const auth = useAuthStore()
const { bottomBarItems, profilePath, isActive } = useNavigation()

// Items are links or buttons; <component :is> needs the resolved NuxtLink component, not its name.
const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-30 flex border-t border-default bg-default pb-[env(safe-area-inset-bottom)] md:hidden"
    aria-label="Main"
  >
    <template v-for="item in bottomBarItems" :key="item.label">
      <component
        :is="item.to ? NuxtLink : 'button'"
        :to="item.to"
        :type="item.to ? undefined : 'button'"
        class="flex h-14 flex-1 items-center justify-center text-highlighted"
        :aria-label="item.label"
        @click="item.action?.()"
      >
        <UIcon :name="isActive(item.to) ? item.activeIcon : item.icon" class="size-7" />
      </component>
    </template>

    <NuxtLink v-if="auth.user" :to="profilePath" class="flex h-14 flex-1 items-center justify-center" aria-label="Profile">
      <UserAvatar
        :user="auth.user"
        size="xs"
        :class="{ 'rounded-full ring-2 ring-(--ui-text-highlighted)': isActive(profilePath) }"
      />
    </NuxtLink>
  </nav>
</template>
