<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'auth', public: true })
useHead({ title: 'Log in · InstaLite' })

const auth = useAuthStore()
const route = useRoute()

const schema = z.object({
  login: z.string().trim().min(1, 'Enter your username or email'),
  password: z.string().min(1, 'Enter your password'),
})
type LoginForm = z.output<typeof schema>

const form = reactive<LoginForm>({ login: '', password: '' })
const submitting = ref(false)
const errorMessage = ref('')

async function onSubmit(event: FormSubmitEvent<LoginForm>) {
  submitting.value = true
  errorMessage.value = ''
  try {
    await auth.login(event.data.login, event.data.password)
    // Go back to the page the user originally wanted (only same-site paths, never full URLs).
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/') ? route.query.redirect : '/'
    await navigateTo(redirect)
  }
  catch (error) {
    errorMessage.value = getErrorMessage(error)
  }
  finally {
    submitting.value = false
  }
}

function useDemoAccount() {
  form.login = 'demo'
  form.password = 'Password123!'
}
</script>

<template>
  <UCard :ui="{ body: 'p-8 sm:p-10' }">
    <div class="mb-8 text-center">
      <span class="font-logo text-5xl text-highlighted">InstaLite</span>
      <p class="mt-2 text-sm text-muted">Sign in to see photos and stories from your friends.</p>
    </div>

    <UForm :schema="schema" :state="form" class="space-y-4" @submit="onSubmit">
      <UFormField name="login" label="Username or email">
        <UInput v-model="form.login" autocomplete="username" autofocus size="lg" class="w-full" />
      </UFormField>

      <UFormField name="password" label="Password">
        <UInput v-model="form.password" type="password" autocomplete="current-password" size="lg" class="w-full" />
      </UFormField>

      <UAlert v-if="errorMessage" :title="errorMessage" color="error" variant="subtle" icon="i-lucide-circle-alert" />

      <UButton type="submit" label="Log in" block size="lg" :loading="submitting" />
    </UForm>

    <USeparator label="OR" class="my-6" />

    <UButton label="Fill in the demo account" color="neutral" variant="soft" block @click="useDemoAccount" />
  </UCard>

  <UCard class="mt-4" :ui="{ body: 'py-5 text-center text-sm' }">
    Don't have an account?
    <NuxtLink to="/register" class="font-semibold text-primary">Sign up</NuxtLink>
  </UCard>
</template>
