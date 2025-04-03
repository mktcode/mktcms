import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('prepareContent')
    .addColumn('userId', 'integer', (col) => col.notNull().unique())
    .addColumn('aboutTargetGroup', 'text', (col) => col.notNull())
    .addColumn('offerShortDescription', 'text', (col) => col.notNull())
    .addColumn('offerDetails', 'text', (col) => col.notNull())
    .addColumn('companyValues', 'text', (col) => col.notNull())
    .addColumn('communicationTone', 'text', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropTable('prepareContent')
    .execute()
}