<script setup lang="ts">
import { postsApi } from '~/api/posts'
import type { PostComment } from '~/types/api'

const props = defineProps<{ comment: PostComment }>()
const emit = defineEmits<{ deleted: [] }>()

const deleting = ref(false)
const showError = useErrorToast()

async function remove() {
  deleting.value = true
  try {
    await postsApi.deleteComment(props.comment.id)
    emit('deleted')
  }
  catch (error) {
    showError(error)
    deleting.value = false
  }
}
</script>

<template>
  <div class="group flex gap-3 py-2">
    <NuxtLink :to="`/u/${comment.author.username}`" class="shrink-0">
      <UserAvatar :user="comment.author" size="sm" />
    </NuxtLink>

    <div class="min-w-0 flex-1 text-sm">
      <NuxtLink :to="`/u/${comment.author.username}`" class="me-1 font-semibold text-highlighted">
        {{ comment.author.username }}
      </NuxtLink>
      <RichText :text="comment.text" />
      <p class="mt-1 text-xs text-muted">{{ timeAgo(comment.createdAt) }}</p>
    </div>

    <UButton
      v-if="comment.canDelete"
      icon="i-lucide-trash-2"
      color="neutral"
      variant="ghost"
      size="xs"
      aria-label="Delete comment"
      :loading="deleting"
      class="self-start opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
      @click="remove"
    />
  </div>
</template>
