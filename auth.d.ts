declare module '#auth-utils' {
  interface User {
    picture: string
  }

  interface SecureSessionData {
    token: string
  }
}

export {}