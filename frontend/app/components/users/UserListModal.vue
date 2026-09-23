<script setup lang="ts">
import type { CursorPage, UserListItem } from '~/types/api'

/**
 * A dialog with a scrollable list of people: followers, following, likes, story viewers...
 * `fetchPage` loads one page of people; lists without paging can return `{ items, nextCursor: null }`.
 */
const props = defineProps<{
  title: string
  fetchPage: (cursor: string | null) => Promise<CursorPage<UserListItem>>
  emptyText?: string
}>()

const open = defineModel<boolean>('open', { required: true })

const { items: users, loading, hasMore, loadMore, reload } = useInfiniteList(cursor => props.fetchPage(cursor))

// Load fresh data every time the dialog opens.
watch(open, (isOpen) => {
  if (isOpen) reload()
}, { immediate: true })
</script>

<template>
  <UModal v-model:open="open" :title="title" :ui="{ body: 'p-0 sm:p-0', content: 'max-w-md' }">
    <template #body>
      <div class="max-h-[60vh] overflow-y-auto px-4">
        <UserRow
          v-for="(user, index) in users"
          :key="user.id"
          v-model:user="users[index]!"
          @navigate="open = false"
        />

        <p v-if="!loading && !hasMore && users.length === 0" class="py-10 text-center text-sm text-muted">
          {{ emptyText ?? 'Nobody here yet.' }}
        </p>

        <InfiniteScrollTrigger :loading="loading" :has-more="hasMore" @load="loadMore" />
      </div>
    </template>
  </UModal>
</template>
