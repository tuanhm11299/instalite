<script setup lang="ts">
/**
 * Shows a caption or comment, turning "@username" into a link to that profile
 * and highlighting "#hashtags".
 */
const props = defineProps<{ text: string }>()

interface Part {
  kind: 'text' | 'mention' | 'hashtag'
  value: string
}

// Same characters as allowed in usernames (letters, numbers, dots, underscores).
const TOKEN_PATTERN = /(@[A-Za-z0-9._]+|#[\p{L}\p{N}_]+)/u

const parts = computed<Part[]>(() =>
  props.text
    .split(TOKEN_PATTERN)
    .filter(value => value !== '')
    .map((value) => {
      if (value.startsWith('@') && value.length > 1) return { kind: 'mention', value }
      if (value.startsWith('#') && value.length > 1) return { kind: 'hashtag', value }
      return { kind: 'text', value }
    }),
)
</script>

<template>
  <span class="whitespace-pre-line break-words">
    <template v-for="(part, index) in parts" :key="index">
      <NuxtLink
        v-if="part.kind === 'mention'"
        :to="`/u/${part.value.slice(1).replace(/\.+$/, '')}`"
        class="text-primary hover:underline"
      >{{ part.value }}</NuxtLink>
      <span v-else-if="part.kind === 'hashtag'" class="text-primary">{{ part.value }}</span>
      <template v-else>{{ part.value }}</template>
    </template>
  </span>
</template>
