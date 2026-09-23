<script setup lang="ts">
import { postsApi } from '~/api/posts'
import type { Post } from '~/types/api'

const MAX_CAPTION_LENGTH = 2200

const open = defineModel<boolean>('open', { required: true })
const post = defineModel<Post>('post', { required: true })

const caption = ref('')
const saving = ref(false)
const showError = useErrorToast()

// Start from the current caption every time the dialog opens.
watch(open, (isOpen) => {
  if (isOpen) caption.value = post.value.caption
})

async function save() {
  saving.value = true
  try {
    post.value = await postsApi.editCaption(post.value.id, caption.value)
    open.value = false
  }
  catch (error) {
    showError(error)
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <UModal v-model:open="open" title="Edit caption">
    <template #body>
      <UTextarea
        v-model="caption"
        :maxlength="MAX_CAPTION_LENGTH"
        :rows="5"
        autoresize
        placeholder="Write a caption…"
        class="w-full"
      />
      <p class="mt-1 text-end text-xs text-muted">{{ caption.length }}/{{ MAX_CAPTION_LENGTH }}</p>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton label="Cancel" color="neutral" variant="ghost" @click="open = false" />
        <UButton label="Save" :loading="saving" @click="save" />
      </div>
    </template>
  </UModal>
</template>
