/** Shows a failed API call to the user as a red toast message. */
export function useErrorToast() {
  const toast = useToast()

  return function showError(error: unknown, fallback?: string) {
    toast.add({
      title: getErrorMessage(error, fallback),
      color: 'error',
      icon: 'i-lucide-circle-alert',
    })
  }
}
