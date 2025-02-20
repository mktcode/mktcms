declare module '#auth-utils' {
  interface User {
    googleId: string
    picture: string
  }

  interface SecureSessionData {
    token: string
  }
}

export {}