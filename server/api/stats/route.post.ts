import { z } from "zod";
import crypto from 'crypto'
import { isbot } from "isbot";
import ismobile from "is-mobile";

const bodySchema = z.object({
  route: z.string(),
})

function isMobileBot(userAgent: string) {
  return {
    isBot: isbot(userAgent),
    isMobile: ismobile({ ua: userAgent }),
  }
}

export default defineEventHandler(async (event) => {
  const userAgent = getRequestHeaders(event)['user-agent'] || 'unknown'
  const referer = getRequestHeaders(event)['referer']
  const { isBot, isMobile } = isMobileBot(userAgent)

  if (isBot) {
    return { success: false }
  }

  const db = await getDatabaseConnection()
  const { route } = await readValidatedBody(event, body => bodySchema.parse(body))
  const { ipHashSalt } = useRuntimeConfig()

  const ip = getRequestHeaders(event)['x-forwarded-for'] 
    || event.node.req.socket.remoteAddress 
    || '0.0.0.0'

  const combinedIdString = `${ip}|${userAgent}`

  const hmac = crypto.createHmac('sha256', ipHashSalt)
  hmac.update(combinedIdString)
  const userId = hmac.digest('hex')

  await db.query(`INSERT INTO stats (userId, route, referer, isMobile) VALUES (?, ?, ?, ?)`, [userId, route, referer, isMobile])
  return { success: true }
})
