import type { StoryTrayItem } from '~/types/api'

interface StoryViewerState {
  open: boolean
  /** Everybody whose stories can be watched in a row (swiping past the last story goes to the next person). */
  groups: StoryTrayItem[]
  startGroupIndex: number
}

/**
 * Opens the full-screen story viewer from anywhere (story tray, profile avatar).
 * The viewer (<StoryViewer>) lives once in layouts/default.vue and reads this shared state.
 */
export function useStoryViewer() {
  const state = useState<StoryViewerState>('story-viewer', () => ({ open: false, groups: [], startGroupIndex: 0 }))

  function open(groups: StoryTrayItem[], startGroupIndex = 0) {
    state.value = { open: true, groups, startGroupIndex }
  }

  function close() {
    state.value = { ...state.value, open: false }
  }

  return { state, open, close }
}
