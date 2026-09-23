<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'
import { usersApi } from '~/api/users'
import type { FollowStatus } from '~/types/api'

/**
 * Follow / Following toggle. Updates instantly and rolls back if the request fails.
 * Use with v-model:following, and listen to @change to update follower counters.
 */
const props = withDefaults(defineProps<{
  username: string
  size?: ButtonProps['size']
  block?: boolean
}>(), {
  size: 'sm',
  block: false,
})

const following = defineModel<boolean>('following', { required: true })
const emit = defineEmits<{ change: [status: FollowStatus] }>()

const busy = ref(false)
const showError = useErrorToast()

async function toggle() {
  if (busy.value) return
  busy.value = true

  const wasFollowing = following.value
  following.value = !wasFollowing

  try {
    const status = wasFollowing
      ? await usersApi.unfollow(props.username)
      : await usersApi.follow(props.username)

    following.value = status.isFollowedByMe
    emit('change', status)
  }
  catch (error) {
    following.value = wasFollowing
    showError(error)
  }
  finally {
    busy.value = false
  }
}
</script>

<template>
  <UButton
    :label="following ? 'Following' : 'Follow'"
    :color="following ? 'neutral' : 'primary'"
    :variant="following ? 'soft' : 'solid'"
    :size="size"
    :block="block"
    class="justify-center"
    @click.stop.prevent="toggle"
  />
</template>
