// Uploaded images (/uploads/**) are served by the .NET API (see server/utils/proxyToApi.ts).
export default defineEventHandler(proxyToApi)
