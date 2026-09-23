import type { H3Event } from 'h3'

/**
 * Forwards the current request to the .NET API (same path and query string) and sends its answer back.
 * Used by server/routes/api/[...path].ts and server/routes/uploads/[...path].ts.
 *
 * It also tells the API who the real visitor is (X-Forwarded-For) and whether they used HTTPS
 * (X-Forwarded-Proto). Without that, every request would seem to come from this Nuxt server and the
 * API's per-IP login rate limit would be shared by all users. The visitor's IP is taken from the
 * network connection and replaces any X-Forwarded-For the visitor sent, so it cannot be faked.
 * (If you put another reverse proxy in front of Nuxt, let that proxy set these headers instead.)
 */
export function proxyToApi(event: H3Event) {
  const { apiUrl } = useRuntimeConfig(event)
  const target = new URL(event.path, apiUrl).toString()

  return proxyRequest(event, target, {
    streamRequest: true, // pass uploads through without holding them in memory
    headers: {
      'x-forwarded-for': getRequestIP(event) ?? '',
      'x-forwarded-proto': getRequestProtocol(event, { xForwardedProto: false }),
    },
  })
}
