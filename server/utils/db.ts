import { Kysely, MysqlDialect } from 'kysely'
import mysql from 'mysql2'
import { Database } from '~/types'

let connection: Kysely<Database> | null = null

export async function getDatabaseConnection() {
  const { databaseUrl } = useRuntimeConfig()

  if (connection) {
    return connection
  }

  connection = new Kysely({
    dialect: new MysqlDialect({ pool: mysql.createPool({ uri: databaseUrl }) }),
  })

  return connection
}

export async function insertDefaultsAfterSignup(userId: number) {
  const db = await getDatabaseConnection()

  await db.insertInto('websites')
    .values({
      userId,
      title: 'Meine Website',
      path: '/',
      isOnline: false,
      showMenu: false,
      hasContactForm: false,
      showAbout: false,
      showContents: false,
      headerVariant: 0,
    })
    .execute()
}