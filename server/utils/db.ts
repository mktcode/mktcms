import mysql from 'mysql2/promise'

let connection: any = null

export async function getDatabaseConnection() {
  if (connection) {
    return connection
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  connection = await mysql.createConnection(process.env.DATABASE_URL)
  return connection
}
