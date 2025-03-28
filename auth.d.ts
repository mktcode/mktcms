declare module '#auth-utils' {
  interface User {
    id: number
    domain: string | null
    email: string | null
    googleId: string
    picture: string
    balance: number
    price: number
  }

  interface SecureSessionData {
    token: string
  }
}

export {}