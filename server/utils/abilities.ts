import { User } from "#auth-utils"

export const manageWebsite = defineAbility((user: User) => {
  const managerGoogleId = process.env.MANAGER_GOOGLE_ID

  return user.googleId !== managerGoogleId
})