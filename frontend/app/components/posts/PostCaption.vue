<script setup lang="ts">
import type { Post } from '~/types/api'

/** "username caption…" with a "more" link for long captions. */
const props = defineProps<{ post: Post }>()

const LONG_CAPTION = 125
const expanded = ref(false)
const isLong = computed(() => props.post.caption.length > LONG_CAPTION)
</script>

<template>
  <p v-if="post.caption" class="text-sm text-default">
    <NuxtLink :to="`/u/${post.author.username}`" class="me-1 font-semibold text-highlighted">
      {{ post.author.username }}
    </NuxtLink>
    <RichText :text="isLong && !expanded ? `${post.caption.slice(0, LONG_CAPTION)}…` : post.caption" />
    <button v-if="isLong && !expanded" type="button" class="ms-1 text-muted" @click="expanded = true">more</button>
  </p>
</template>
