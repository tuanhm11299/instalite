import type { ProblemDetails } from '~/types/api'

// Helpers to read errors thrown by $fetch / apiRequest.
// (Files in utils/ are auto-imported by Nuxt, so these can be used anywhere without an import.)

/** The problem-details body the API sent, if any. */
export function getProblemDetails(error: unknown): ProblemDetails | undefined {
  return (error as { data?: ProblemDetails } | undefined)?.data
}

/** HTTP status code of a failed request (undefined for network errors). */
export function getErrorStatus(error: unknown): number | undefined {
  return (error as { statusCode?: number } | undefined)?.statusCode ?? getProblemDetails(error)?.status
}

/** A message that can be shown to the user as-is. */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (getErrorStatus(error) === 429) return 'Too many attempts. Please wait a minute and try again.'

  const problem = getProblemDetails(error)
  const firstFieldError = problem?.errors ? Object.values(problem.errors).flat()[0] : undefined

  return firstFieldError ?? problem?.detail ?? fallback
}

/**
 * Validation errors from the API in the format Nuxt UI's <UForm> expects,
 * so server-side errors show up under the right form field: `form.setErrors(getFormErrors(error))`.
 */
export function getFormErrors(error: unknown): { name: string, message: string }[] {
  const fieldErrors = getProblemDetails(error)?.errors ?? {}
  return Object.entries(fieldErrors).flatMap(([name, messages]) => messages.map(message => ({ name, message })))
}
