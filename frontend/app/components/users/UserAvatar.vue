<script setup lang="ts">
import type { AvatarProps } from '@nuxt/ui'

/**
 * A round profile picture. Falls back to the user's initials when there is no picture.
 * `ring` draws the story ring: colorful for unseen stories, grey for seen ones.
 * `avatarClass` sets a custom size (e.g. "size-16") when the preset `size` values are too small.
 */
withDefaults(defineProps<{
  user: { username: string, displayName?: string, avatarUrl: string | null }
  size?: AvatarProps['size']
  ring?: 'none' | 'unseen' | 'seen'
  avatarClass?: string
}>(), {
  size: 'md',
  ring: 'none',
  avatarClass: '',
})
</script>

<template>
  <span
    class="inline-flex shrink-0 rounded-full"
    :class="{
      'story-ring p-[2px]': ring === 'unseen',
      'bg-accented p-[1.5px]': ring === 'seen',
    }"
  >
    <span class="inline-flex rounded-full" :class="{ 'bg-default p-[2px]': ring !== 'none' }">
      <UAvatar
        :src="user.avatarUrl ?? undefined"
        :alt="user.displayName || user.username"
        :size="size"
        :class="avatarClass"
        :ui="{ image: 'object-cover' }"
      />
    </span>
  </span>
</template>
