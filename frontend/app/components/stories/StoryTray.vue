<script setup lang="ts">
import { storiesApi } from '~/api/stories'
import { useAuthStore } from '~/stores/auth'
import type { StoryTrayItem } from '~/types/api'

/**
 * The row of round avatars at the top of the feed.
 * The first circle is always "Your story": tap "+" to add a photo that disappears after 24 hours.
 */
const auth = useAuthStore()
const storyViewer = useStoryViewer()
const toast = useToast()
const showError = useErrorToast()

const tray = ref<StoryTrayItem[]>([])
const loading = ref(true)
const uploading = ref(false)
const fileInput = useTemplateRef('fileInput')

const myItem = computed(() => tray.value.find(item => item.user.id === auth.user?.id))
const otherItems = computed(() => tray.value.filter(item => item.user.id !== auth.user?.id))

async function loadTray() {
  try {
    tray.value = await storiesApi.tray()
  }
  catch (error) {
    showError(error)
  }
  finally {
    loading.value = false
  }
}

onMounted(loadTray)

// Reload when the viewer closes: stories may have been seen or deleted.
watch(() => storyViewer.state.value.open, (isOpen) => {
  if (!isOpen) loadTray()
})

function hasUnseen(item: StoryTrayItem) {
  return item.stories.some(story => !story.isViewedByMe)
}

function openStories(item: StoryTrayItem) {
  storyViewer.open(tray.value, tray.value.indexOf(item))
}

async function onStoryFileChosen(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  const problem = validateImageFile(file)
  if (problem) {
    toast.add({ title: problem, color: 'error' })
    return
  }

  uploading.value = true
  try {
    await storiesApi.create(file)
    toast.add({ title: 'Your story is live for 24 hours', icon: 'i-lucide-check', color: 'success' })
    await loadTray()
  }
  catch (error) {
    showError(error)
  }
  finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="no-scrollbar flex gap-4 overflow-x-auto px-3 py-3 sm:px-0">
    <input ref="fileInput" type="file" :accept="ACCEPTED_IMAGE_TYPES" class="hidden" @change="onStoryFileChosen">

    <!-- Your story -->
    <div v-if="auth.user" class="flex w-[76px] shrink-0 flex-col items-center gap-1">
      <div class="relative">
        <button
          type="button"
          :aria-label="myItem ? 'View your story' : 'Add to your story'"
          @click="myItem ? openStories(myItem) : fileInput?.click()"
        >
          <UserAvatar :user="auth.user" size="3xl" avatar-class="size-16 text-xl" :ring="myItem ? 'seen' : 'none'" />
        </button>
        <UButton
          :icon="uploading ? 'i-lucide-loader-circle' : 'i-lucide-plus'"
          size="xs"
          class="absolute -bottom-0.5 -end-0.5 rounded-full ring-2 ring-(--ui-bg)"
          :class="{ '[&_span]:animate-spin': uploading }"
          :disabled="uploading"
          aria-label="Add to your story"
          @click="fileInput?.click()"
        />
      </div>
      <span class="w-full truncate text-center text-xs text-muted">Your story</span>
    </div>

    <!-- Loading placeholders -->
    <template v-if="loading">
      <div v-for="n in 5" :key="n" class="flex w-[76px] shrink-0 flex-col items-center gap-1">
        <USkeleton class="size-16 rounded-full" />
        <USkeleton class="h-2.5 w-12" />
      </div>
    </template>

    <!-- People you follow -->
    <button
      v-for="item in otherItems"
      :key="item.user.id"
      type="button"
      class="flex w-[76px] shrink-0 flex-col items-center gap-1"
      :aria-label="`View ${item.user.username}'s story`"
      @click="openStories(item)"
    >
      <UserAvatar :user="item.user" size="3xl" avatar-class="size-16 text-xl" :ring="hasUnseen(item) ? 'unseen' : 'seen'" />
      <span class="w-full truncate text-center text-xs" :class="hasUnseen(item) ? 'text-highlighted' : 'text-muted'">
        {{ item.user.username }}
      </span>
    </button>
  </div>
</template>
