<script setup lang="ts">
import { usersApi } from '~/api/users'
import type { UserListItem } from '~/types/api'

/** "Suggested for you": popular people you don't follow yet. */
const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 5 })

const users = ref<UserListItem[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    users.value = await usersApi.suggestions(props.limit)
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <section>
    <div class="mb-2 flex items-center justify-between">
      <h2 class="text-sm font-semibold text-muted">Suggested for you</h2>
      <NuxtLink to="/search" class="text-xs font-semibold text-highlighted hover:text-muted">See all</NuxtLink>
    </div>

    <template v-if="loading">
      <div v-for="n in 3" :key="n" class="flex items-center gap-3 py-2">
        <USkeleton class="size-10 rounded-full" />
        <div class="flex-1 space-y-2">
          <USkeleton class="h-3 w-24" />
          <USkeleton class="h-3 w-32" />
        </div>
      </div>
    </template>

    <UserRow v-for="(user, index) in users" :key="user.id" v-model:user="users[index]!" />

    <p v-if="!loading && users.length === 0" class="py-2 text-sm text-muted">You follow everyone. Nice!</p>
  </section>
</template>
