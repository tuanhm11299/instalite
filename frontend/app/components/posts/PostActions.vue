<script setup lang="ts">
import type { Post } from '~/types/api'

/** The row of buttons under a photo: like, comment, share … save. */
const post = defineModel<Post>('post', { required: true })
defineEmits<{ comment: [] }>()

const { toggleLike, toggleSave, share } = usePostActions(post)
</script>

<template>
  <div class="-mx-2 flex items-center">
    <UButton
      :icon="post.isLikedByMe ? 'i-ph-heart-fill' : 'i-ph-heart'"
      :aria-label="post.isLikedByMe ? 'Unlike' : 'Like'"
      color="neutral"
      variant="link"
      size="xl"
      :class="post.isLikedByMe ? 'text-red-500 hover:text-red-600' : 'text-highlighted'"
      @click="toggleLike"
    />
    <UButton
      icon="i-ph-chat-circle"
      aria-label="Comment"
      color="neutral"
      variant="link"
      size="xl"
      class="text-highlighted"
      @click="$emit('comment')"
    />
    <UButton
      icon="i-ph-paper-plane-tilt"
      aria-label="Share"
      color="neutral"
      variant="link"
      size="xl"
      class="text-highlighted"
      @click="share"
    />
    <UButton
      :icon="post.isSavedByMe ? 'i-ph-bookmark-simple-fill' : 'i-ph-bookmark-simple'"
      :aria-label="post.isSavedByMe ? 'Remove from saved' : 'Save'"
      color="neutral"
      variant="link"
      size="xl"
      class="ms-auto text-highlighted"
      @click="toggleSave"
    />
  </div>
</template>
