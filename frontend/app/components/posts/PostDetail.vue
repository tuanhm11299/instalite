<script setup lang="ts">
import { postsApi } from '~/api/posts'
import type { Post, PostComment } from '~/types/api'

/**
 * A post with all its comments (the /p/:id page).
 * Desktop: photo on the left, comments on the right. Phone: everything stacked.
 */
const post = defineModel<Post>('post', { required: true })
defineEmits<{ deleted: [] }>()

const { likeFromDoubleTap } = usePostActions(post)
const likesOpen = ref(false)
const commentForm = useTemplateRef('commentForm')

const { items: comments, loading, hasMore, loadMore, removeWhere } =
  useInfiniteList(cursor => postsApi.comments(post.value.id, cursor))

function onCommentAdded(comment: PostComment) {
  // Only show it right away when all older comments are loaded; otherwise it appears when scrolling down.
  if (!hasMore.value) comments.value.push(comment)
  post.value = { ...post.value, commentCount: post.value.commentCount + 1 }
}

function onCommentDeleted(commentId: string) {
  removeWhere(comment => comment.id === commentId)
  post.value = { ...post.value, commentCount: Math.max(0, post.value.commentCount - 1) }
}
</script>

<template>
  <div class="overflow-hidden border-default lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:rounded-lg lg:border">
    <PostImages
      :image-urls="post.imageUrls"
      :alt="`Photo by ${post.author.username}`"
      fit="contain"
      class="lg:self-center"
      @double-tap="likeFromDoubleTap"
    />

    <div class="flex min-h-0 flex-col lg:max-h-[min(80vh,720px)] lg:border-s lg:border-default">
      <header class="flex items-center gap-3 border-b border-default px-4 py-3">
        <NuxtLink :to="`/u/${post.author.username}`" class="flex min-w-0 flex-1 items-center gap-3">
          <UserAvatar :user="post.author" size="sm" />
          <span class="truncate text-sm font-semibold text-highlighted">{{ post.author.username }}</span>
        </NuxtLink>
        <PostMenu v-model:post="post" @deleted="$emit('deleted')" />
      </header>

      <!-- Caption first, then the comments. -->
      <div class="flex-1 overflow-y-auto px-4 py-2">
        <div v-if="post.caption" class="flex gap-3 py-2">
          <UserAvatar :user="post.author" size="sm" />
          <div class="min-w-0 text-sm">
            <PostCaption :post="post" />
            <p class="mt-1 text-xs text-muted">{{ timeAgo(post.createdAt) }}</p>
          </div>
        </div>

        <CommentItem
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          @deleted="onCommentDeleted(comment.id)"
        />

        <p v-if="!loading && !hasMore && comments.length === 0" class="py-8 text-center text-sm text-muted">
          No comments yet. Start the conversation.
        </p>

        <InfiniteScrollTrigger :loading="loading" :has-more="hasMore" @load="loadMore" />
      </div>

      <div class="space-y-1 border-t border-default px-4 pb-3 pt-1">
        <PostActions v-model:post="post" @comment="commentForm?.focus()" />
        <button
          v-if="post.likeCount > 0"
          type="button"
          class="block text-sm font-semibold text-highlighted"
          @click="likesOpen = true"
        >
          {{ pluralize(post.likeCount, 'like') }}
        </button>
        <p class="text-xs uppercase tracking-wide text-muted">{{ timeAgo(post.createdAt) }}</p>
        <USeparator class="py-1" />
        <CommentForm ref="commentForm" :post-id="post.id" @added="onCommentAdded" />
      </div>
    </div>

    <UserListModal
      v-model:open="likesOpen"
      title="Likes"
      :fetch-page="async () => ({ items: await postsApi.likes(post.id), nextCursor: null })"
    />
  </div>
</template>
