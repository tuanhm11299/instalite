<script setup lang="ts">
/**
 * The photo(s) of a post. Several photos become a swipeable carousel with dots.
 * Double-tapping (or double-clicking) emits "double-tap" and shows a big heart.
 */
const props = withDefaults(defineProps<{
  imageUrls: string[]
  alt: string
  /** "cover" crops to a square (feed); "contain" shows the whole photo on black (post page). */
  fit?: 'cover' | 'contain'
}>(), {
  fit: 'cover',
})

const emit = defineEmits<{ 'double-tap': [] }>()

const DOUBLE_TAP_MS = 300
let lastTapAt = 0
const heartVisible = ref(false)
let heartTimer: ReturnType<typeof setTimeout> | undefined

function onTap() {
  const now = Date.now()
  if (now - lastTapAt < DOUBLE_TAP_MS) {
    lastTapAt = 0
    showHeart()
    emit('double-tap')
  }
  else {
    lastTapAt = now
  }
}

function showHeart() {
  heartVisible.value = false
  clearTimeout(heartTimer)
  // Wait a frame so the animation restarts even when double-tapping repeatedly.
  requestAnimationFrame(() => {
    heartVisible.value = true
    heartTimer = setTimeout(() => (heartVisible.value = false), 900)
  })
}

onBeforeUnmount(() => clearTimeout(heartTimer))

const imageClass = computed(() => [
  'aspect-square w-full select-none',
  props.fit === 'cover' ? 'object-cover' : 'object-contain bg-black',
])
</script>

<template>
  <div class="relative bg-muted" @click="onTap">
    <UCarousel
      v-if="imageUrls.length > 1"
      v-slot="{ item, index }"
      :items="imageUrls"
      arrows
      dots
      :prev="{ color: 'neutral', variant: 'solid', size: 'xs' }"
      :next="{ color: 'neutral', variant: 'solid', size: 'xs' }"
      :ui="{
        container: 'ms-0',
        item: 'ps-0',
        prev: 'start-2 sm:start-2 opacity-80 disabled:hidden',
        next: 'end-2 sm:end-2 opacity-80 disabled:hidden',
        dots: 'bottom-3 gap-1.5',
        dot: 'size-1.5 bg-white/50 data-[state=active]:bg-white',
      }"
    >
      <img
        :src="item"
        :alt="`${alt} (photo ${index + 1} of ${imageUrls.length})`"
        :class="imageClass"
        loading="lazy"
        draggable="false"
      >
    </UCarousel>

    <img v-else :src="imageUrls[0]" :alt="alt" :class="imageClass" loading="lazy" draggable="false">

    <div v-if="heartVisible" class="pointer-events-none absolute inset-0 flex items-center justify-center">
      <UIcon name="i-ph-heart-fill" class="animate-like-pop size-28 text-white drop-shadow-xl" />
    </div>
  </div>
</template>
