import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('privacy')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('userId', 'integer', (col) => col.notNull())
    .addColumn('needsOfficer', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('officerName', 'text')
    .addColumn('officerEmail', 'text')
    .addColumn('officerPhone', 'text')
    .addColumn('usesOfflineData', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('offlineDataText', 'text')
    .addColumn('usesOtherServiceProviders', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('otherServiceProviders', 'json')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropTable('privacy')
    .execute()
}