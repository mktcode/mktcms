import { prepareContentFormSchema } from "~/types";

export default defineEventHandler(async (event) => {
  const prepareContent = await readValidatedBody(event, body => prepareContentFormSchema.parse(body))
  const { user } = await requireUserSession(event)
  
  const suggestions = await suggestSloganFromUserInfo({
    userId: user.id,
    ...prepareContent
  })

  return { success: true, error: null, suggestions }
})
