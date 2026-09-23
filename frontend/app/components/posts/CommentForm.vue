<script setup lang="ts">
import { postsApi } from '~/api/posts'
import type { PostComment } from '~/types/api'

/** "Add a comment…" input with a Post button. Emits the new comment once the API has saved it. */
const props = defineProps<{ postId: string }>()
const emit = defineEmits<{ added: [comment: PostComment] }>()

const text = ref('')
const sending = ref(false)
const showError = useErrorToast()
const input = useTemplateRef('input')

async function submit() {
  const trimmed = text.value.trim()
  if (!trimmed || sending.value) return

  sending.value = true
  try {
    const comment = await postsApi.addComment(props.postId, trimmed)
    text.value = ''
    emit('added', comment)
  }
  catch (error) {
    showError(error)
  }
  finally {
    sending.value = false
  }
}

/** Lets the parent put the cursor in the input (e.g. when the comment icon is clicked). */
function focus() {
  input.value?.inputRef?.focus()
}

defineExpose({ focus })
</script>

<template>
  <form class="flex items-center gap-2" @submit.prevent="submit">
    <UInput
      ref="input"
      v-model="text"
      placeholder="Add a comment…"
      variant="none"
      :maxlength="1000"
      class="flex-1"
      :ui="{ base: 'px-0' }"
      aria-label="Add a comment"
    />
    <UButton
      v-if="text.trim()"
      type="submit"
      label="Post"
      variant="link"
      :loading="sending"
      class="px-0 font-semibold"
    />
  </form>
</template>
