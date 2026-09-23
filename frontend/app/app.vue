<template>
  <!-- UApp provides Nuxt UI's global features: toasts, tooltips and programmatic overlays. -->
  <UApp :toaster="{ position: 'top-center' }">
    <NuxtLoadingIndicator color="var(--ui-primary)" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
