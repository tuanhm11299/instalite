/**
 * Opens the "Create new post" dialog from anywhere (sidebar, bottom bar, empty states...).
 * The dialog itself (<CreatePostModal>) lives once in layouts/default.vue.
 */
export function useCreatePost() {
  const isOpen = useState('create-post-open', () => false)

  return {
    isOpen,
    open: () => { isOpen.value = true },
  }
}
