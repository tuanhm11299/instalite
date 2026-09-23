// Nuxt configuration. Docs: https://nuxt.com/docs/api/nuxt-config
//
// The browser only ever talks to this Nuxt server. Requests to /api/** and /uploads/**
// are forwarded ("proxied") to the .NET API, so frontend and API share one origin:
// no CORS setup is needed and the http-only refresh-token cookie just works.
const apiUrl = process.env.NUXT_API_URL ?? 'http://localhost:5080'

export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',

  // A logged-in app like this one does not need server-side rendering: it runs as a single page app.
  ssr: false,

  modules: ['@nuxt/ui', '@pinia/nuxt'],

  css: ['~/assets/css/main.css'],

  // Components are used by their file name only: components/posts/PostCard.vue → <PostCard>.
  // (Sub-folders are just for organising files.)
  components: [{ path: '~/components', pathPrefix: false }],

  devtools: { enabled: true },

  app: {
    head: {
      title: 'InstaLite',
      meta: [
        // viewport-fit=cover lets the bottom navigation use the space around the iPhone home indicator.
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Share photos and stories with your friends.' },
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  routeRules: {
    '/api/**': { proxy: `${apiUrl}/api/**` },
    '/uploads/**': { proxy: `${apiUrl}/uploads/**` },
  },

  vite: {
    // Pre-bundle dependencies that are only imported by some pages, so the dev server
    // doesn't have to reload the browser the first time such a page is opened.
    optimizeDeps: { include: ['zod'] },
  },

  icon: {
    // Nuxt Icon serves icons from /api/_nuxt_icon by default, which would be caught by the /api proxy above.
    localApiEndpoint: '/_nuxt_icon',
    // Bundle the icons we use into the app so they never have to be downloaded separately.
    clientBundle: { scan: true },
  },
})
