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
