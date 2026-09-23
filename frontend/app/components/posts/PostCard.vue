<script setup lang="ts">
import { postsApi } from '~/api/posts'
import type { Post } from '~/types/api'

/** A post in the home feed. Use with v-model:post so likes/saves/edits update the list. */
const post = defineModel<Post>('post', { required: true })
defineEmits<{ deleted: [] }>()

const { likeFromDoubleTap } = usePostActions(post)
const likesOpen = ref(false)

function onCommentAdded() {
  post.value = { ...post.value, commentCount: post.value.commentCount + 1 }
  useToast().add({ title: 'Comment posted', icon: 'i-lucide-check' })
}
</script>

<template>
  <article class="border-b border-default pb-4 sm:border-none">
    <header class="flex items-center gap-3 px-3 py-2.5 sm:px-0">
      <NuxtLink :to="`/u/${post.author.username}`">
        <UserAvatar :user="post.author" size="sm" />
      </NuxtLink>
      <p class="min-w-0 flex-1 truncate text-sm">
        <NuxtLink :to="`/u/${post.author.username}`" class="font-semibold text-highlighted">
          {{ post.author.username }}
        </NuxtLink>
        <span class="text-muted"> • {{ timeAgo(post.createdAt) }}</span>
      </p>
      <PostMenu v-model:post="post" @deleted="$emit('deleted')" />
    </header>

    <PostImages
      :image-urls="post.imageUrls"
      :alt="`Photo by ${post.author.username}`"
      class="overflow-hidden sm:rounded-md sm:border sm:border-default"
      @double-tap="likeFromDoubleTap"
    />

    <div class="space-y-1.5 px-3 pt-1 sm:px-0">
      <PostActions v-model:post="post" @comment="navigateTo(`/p/${post.id}`)" />

      <button
        v-if="post.likeCount > 0"
        type="button"
        class="text-sm font-semibold text-highlighted"
        @click="likesOpen = true"
      >
        {{ pluralize(post.likeCount, 'like') }}
      </button>

      <PostCaption :post="post" />

      <NuxtLink v-if="post.commentCount > 0" :to="`/p/${post.id}`" class="block text-sm text-muted">
        View {{ post.commentCount === 1 ? 'the comment' : `all ${compactNumber(post.commentCount)} comments` }}
      </NuxtLink>

      <CommentForm :post-id="post.id" @added="onCommentAdded" />
    </div>

    <UserListModal
      v-model:open="likesOpen"
      title="Likes"
      :fetch-page="async () => ({ items: await postsApi.likes(post.id), nextCursor: null })"
    />
  </article>
</template>
