<script setup lang="ts">
import { postsApi } from '~/api/posts'

/**
 * "Create new post" dialog: pick up to 10 photos (click or drag & drop), write a caption, share.
 * Opened through useCreatePost(); lives once in layouts/default.vue.
 */
const MAX_CAPTION_LENGTH = 2200

const { isOpen } = useCreatePost()
const toast = useToast()
const showError = useErrorToast()

interface SelectedImage {
  file: File
  previewUrl: string
}

const images = ref<SelectedImage[]>([])
const caption = ref('')
const sharing = ref(false)
const dragging = ref(false)
const fileInput = useTemplateRef('fileInput')

function addFiles(files: FileList | File[]) {
  for (const file of Array.from(files)) {
    if (images.value.length >= MAX_IMAGES_PER_POST) {
      toast.add({ title: `You can add up to ${MAX_IMAGES_PER_POST} photos.`, color: 'warning' })
      break
    }

    const problem = validateImageFile(file)
    if (problem) {
      toast.add({ title: problem, color: 'error' })
      continue
    }

    images.value.push({ file, previewUrl: URL.createObjectURL(file) })
  }
}

function removeImage(index: number) {
  const [removed] = images.value.splice(index, 1)
  if (removed) URL.revokeObjectURL(removed.previewUrl)
}

function onFileInputChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files) addFiles(input.files)
  input.value = '' // allow picking the same file again
}

function onDrop(event: DragEvent) {
  dragging.value = false
  if (event.dataTransfer?.files) addFiles(event.dataTransfer.files)
}

function reset() {
  images.value.forEach(image => URL.revokeObjectURL(image.previewUrl))
  images.value = []
  caption.value = ''
}

async function share() {
  if (images.value.length === 0) return

  sharing.value = true
  try {
    const post = await postsApi.create(caption.value, images.value.map(image => image.file))
    isOpen.value = false
    reset()
    toast.add({ title: 'Your post has been shared', icon: 'i-lucide-check', color: 'success' })
    await navigateTo(`/p/${post.id}`)
  }
  catch (error) {
    showError(error)
  }
  finally {
    sharing.value = false
  }
}

onBeforeUnmount(reset)
</script>

<template>
  <UModal v-model:open="isOpen" title="Create new post" :dismissible="!sharing" :ui="{ content: 'max-w-xl' }">
    <template #body>
      <input
        ref="fileInput"
        type="file"
        :accept="ACCEPTED_IMAGE_TYPES"
        multiple
        class="hidden"
        @change="onFileInputChange"
      >

      <!-- Step 1: no photos yet → big drop zone. -->
      <button
        v-if="images.length === 0"
        type="button"
        class="flex aspect-square w-full flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed transition-colors"
        :class="dragging ? 'border-primary bg-primary/5' : 'border-default'"
        @click="fileInput?.click()"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="onDrop"
      >
        <UIcon name="i-lucide-images" class="size-16 text-muted" />
        <span class="text-lg text-highlighted">Drag photos here</span>
        <span class="text-sm text-muted">JPEG, PNG, WebP or GIF · up to {{ MAX_IMAGES_PER_POST }} photos · 10 MB each</span>
        <UButton label="Select from computer" tabindex="-1" />
      </button>

      <!-- Step 2: preview + caption. -->
      <div v-else class="space-y-4">
        <div class="grid grid-cols-3 gap-2 sm:grid-cols-4">
          <div v-for="(image, index) in images" :key="image.previewUrl" class="relative aspect-square">
            <img :src="image.previewUrl" alt="" class="size-full rounded-md object-cover">
            <span v-if="index === 0" class="absolute start-1 top-1 rounded bg-black/60 px-1.5 text-xs text-white">Cover</span>
            <UButton
              icon="i-lucide-x"
              size="xs"
              color="neutral"
              class="absolute end-1 top-1 rounded-full"
              aria-label="Remove photo"
              @click="removeImage(index)"
            />
          </div>

          <button
            v-if="images.length < MAX_IMAGES_PER_POST"
            type="button"
            class="flex aspect-square items-center justify-center rounded-md border-2 border-dashed border-default text-muted hover:text-highlighted"
            aria-label="Add more photos"
            @click="fileInput?.click()"
          >
            <UIcon name="i-lucide-plus" class="size-8" />
          </button>
        </div>

        <div>
          <UTextarea
            v-model="caption"
            :maxlength="MAX_CAPTION_LENGTH"
            :rows="4"
            autoresize
            placeholder="Write a caption… Use @username to mention people and #hashtags."
            class="w-full"
          />
          <p class="mt-1 text-end text-xs text-muted">{{ caption.length }}/{{ MAX_CAPTION_LENGTH }}</p>
        </div>
      </div>
    </template>

    <template v-if="images.length > 0" #footer>
      <div class="flex w-full justify-between gap-2">
        <UButton label="Start over" color="neutral" variant="ghost" :disabled="sharing" @click="reset" />
        <UButton label="Share" icon="i-lucide-send" :loading="sharing" @click="share" />
      </div>
    </template>
  </UModal>
</template>
