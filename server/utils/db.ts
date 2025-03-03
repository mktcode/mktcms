import { Kysely, MysqlDialect, SqliteDialect } from 'kysely'
import mysql from 'mysql2/promise'
import BetterSqlite3 from 'better-sqlite3'
import { Database } from '~/types'

let connection: Kysely<Database> | null = null

export async function getDatabaseConnection() {
  const { databaseUrl } = useRuntimeConfig()

  if (connection) {
    return connection
  }

  if (process.env.NODE_ENV === 'production') {
    connection = new Kysely({
      dialect: new MysqlDialect({ pool: mysql.createPool({ uri: databaseUrl }) }),
    })
  } else {
    connection = new Kysely({
      dialect: new MysqlDialect({ pool: mysql.createPool({ uri: databaseUrl + '_dev' }) }),
    })
  }

  return connection
}
