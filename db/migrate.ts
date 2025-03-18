import * as path from 'path'
import { promises as fs } from 'fs'
import mysql from 'mysql2'
import {
  Kysely,
  Migrator,
  FileMigrationProvider,
  MysqlDialect,
} from 'kysely'
import type { Database } from '../types'

async function migrateToLatest() {
  const databaseUrl = process.env.DATABASE_URL || process.env.NUXT_DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }

  const db = new Kysely<Database>({
    dialect: new MysqlDialect({ pool: mysql.createPool({ uri: databaseUrl }) })
  })

  const migrationFolder = path.join(import.meta.dirname, 'migrations')
  const migrator = new Migrator({ db, provider: new FileMigrationProvider({ fs, path, migrationFolder }) })

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

migrateToLatest()