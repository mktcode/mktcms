import mysql from 'mysql2/promise'

export async function getDatabaseConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  return mysql.createConnection(process.env.DATABASE_URL)
}
