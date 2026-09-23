<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import type { UserListItem } from '~/types/api'

/** One person in a list: avatar, username, display name and a Follow button (hidden for yourself). */
const user = defineModel<UserListItem>('user', { required: true })
defineEmits<{ navigate: [] }>()

const auth = useAuthStore()
const isMe = computed(() => auth.user?.id === user.value.id)
</script>

<template>
  <div class="flex items-center gap-3 py-2">
    <NuxtLink :to="`/u/${user.username}`" class="flex min-w-0 flex-1 items-center gap-3" @click="$emit('navigate')">
      <UserAvatar :user="user" size="lg" />
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-highlighted">{{ user.username }}</p>
        <p class="truncate text-sm text-muted">{{ user.displayName }}</p>
      </div>
    </NuxtLink>

    <FollowButton v-if="!isMe" v-model:following="user.isFollowedByMe" :username="user.username" size="xs" />
  </div>
</template>
