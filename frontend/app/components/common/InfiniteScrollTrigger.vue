<script setup lang="ts">
/**
 * Put this at the bottom of a list. It emits "load" when it scrolls into view,
 * so the parent can fetch the next page (see composables/useInfiniteList.ts).
 */
const props = defineProps<{
  loading: boolean
  hasMore: boolean
}>()

const emit = defineEmits<{ load: [] }>()

const element = ref<HTMLElement>()
let observer: IntersectionObserver | undefined

// Start loading a bit before the user actually reaches the end of the list.
const PRELOAD_DISTANCE_PX = 400

function requestLoad() {
  if (!props.loading && props.hasMore) emit('load')
}

function isNearViewport() {
  const top = element.value?.getBoundingClientRect().top ?? Infinity
  return top < window.innerHeight + PRELOAD_DISTANCE_PX
}

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) requestLoad()
    },
    { rootMargin: `${PRELOAD_DISTANCE_PX}px` },
  )
  observer.observe(element.value!)
})

onBeforeUnmount(() => observer?.disconnect())

// When a page was short, the trigger can still be visible after loading: keep loading until the screen is full.
watch(() => props.loading, (loading) => {
  if (!loading && isNearViewport()) requestLoad()
}, { flush: 'post' })
</script>

<template>
  <div ref="element" class="flex justify-center py-6">
    <UIcon v-if="loading" name="i-lucide-loader-circle" class="size-6 animate-spin text-muted" />
  </div>
</template>
