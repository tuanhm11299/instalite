import type { CursorPage } from '~/types/api'

/**
 * State for a list that loads more items as the user scrolls (feed, grids, comments...).
 *
 *   const { items, loading, hasMore, loadMore, reload } = useInfiniteList(cursor => postsApi.feed(cursor))
 *   onMounted(loadMore)
 *
 * Pair it with <InfiniteScrollTrigger> at the bottom of the list to call loadMore automatically.
 */
export function useInfiniteList<T>(fetchPage: (cursor: string | null) => Promise<CursorPage<T>>) {
  const items = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)
  const hasMore = ref(true)
  const error = ref<unknown>(null)
  let cursor: string | null = null

  // Increases on every reload, so a slow response for an old list is ignored.
  let generation = 0

  async function loadMore() {
    if (loading.value || !hasMore.value) return

    const requestGeneration = generation
    loading.value = true
    error.value = null

    try {
      const page = await fetchPage(cursor)
      if (requestGeneration !== generation) return

      items.value.push(...page.items)
      cursor = page.nextCursor
      hasMore.value = page.nextCursor !== null
    }
    catch (e) {
      if (requestGeneration === generation) error.value = e
    }
    finally {
      if (requestGeneration === generation) loading.value = false
    }
  }

  /** Empties the list and loads the first page again. */
  async function reload() {
    generation++
    items.value = []
    cursor = null
    hasMore.value = true
    loading.value = false
    await loadMore()
  }

  /** Removes items without reloading, e.g. after deleting a post. */
  function removeWhere(predicate: (item: T) => boolean) {
    items.value = items.value.filter(item => !predicate(item))
  }

  return { items, loading, hasMore, error, loadMore, reload, removeWhere }
}
