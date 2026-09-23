<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { postsApi } from '~/api/posts'
import { useAuthStore } from '~/stores/auth'
import type { Post } from '~/types/api'

/** The "…" menu of a post. Authors can also edit the caption and delete the post. */
const post = defineModel<Post>('post', { required: true })
const emit = defineEmits<{ deleted: [] }>()

const auth = useAuthStore()
const toast = useToast()
const showError = useErrorToast()
const isMine = computed(() => post.value.author.id === auth.user?.id)

const editOpen = ref(false)
const deleteOpen = ref(false)
const deleting = ref(false)

const items = computed<DropdownMenuItem[][]>(() => {
  const general: DropdownMenuItem[] = [
    { label: 'Go to post', icon: 'i-lucide-square-arrow-out-up-right', to: `/p/${post.value.id}` },
    { label: 'Copy link', icon: 'i-lucide-link', onSelect: copyLink },
  ]

  if (!isMine.value) return [general]

  return [
    [
      { label: 'Edit caption', icon: 'i-lucide-pencil', onSelect: () => (editOpen.value = true) },
      { label: 'Delete', icon: 'i-lucide-trash-2', color: 'error', onSelect: () => (deleteOpen.value = true) },
    ],
    general,
  ]
})

async function copyLink() {
  await navigator.clipboard.writeText(`${window.location.origin}/p/${post.value.id}`)
  toast.add({ title: 'Link copied to clipboard', icon: 'i-lucide-link' })
}

async function deletePost() {
  deleting.value = true
  try {
    await postsApi.remove(post.value.id)
    deleteOpen.value = false
    toast.add({ title: 'Post deleted', icon: 'i-lucide-trash-2' })
    emit('deleted')
  }
  catch (error) {
    showError(error)
  }
  finally {
    deleting.value = false
  }
}
</script>

<template>
  <UDropdownMenu :items="items" :content="{ align: 'end' }">
    <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" aria-label="More options" />
  </UDropdownMenu>

  <EditCaptionModal v-if="isMine" v-model:open="editOpen" v-model:post="post" />

  <UModal v-model:open="deleteOpen" title="Delete post?" description="This cannot be undone." :ui="{ content: 'max-w-sm' }">
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton label="Cancel" color="neutral" variant="ghost" @click="deleteOpen = false" />
        <UButton label="Delete" color="error" :loading="deleting" @click="deletePost" />
      </div>
    </template>
  </UModal>
</template>
