declare module '#auth-utils' {
  interface User {
    id: number
    domain: string
    googleId: string
    picture: string
  }

  interface SecureSessionData {
    token: string
  }
}

export {}