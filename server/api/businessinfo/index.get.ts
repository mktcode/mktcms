export default defineEventHandler(async () => {
  const db = await getDatabaseConnection()

  const businessinfo = await db.selectFrom('businessinfo')
    .select(['id', 'name', 'street', 'city', 'zip', 'phone', 'email', 'taxId'])
    .limit(1)
    .execute()
    .then(posts => {
      if (posts.length === 0) {
        return null
      }
      return posts[0]
    })
  
  return businessinfo
})
