// Every /api/** request from the browser is forwarded to the .NET API (see server/utils/proxyToApi.ts).
export default defineEventHandler(proxyToApi)
