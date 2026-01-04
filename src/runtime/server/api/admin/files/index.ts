export default defineEventHandler(async () => {
  const storage = useStorage('mktcmsUploads')
  const keys = await storage.getKeys()

  return keys
})
