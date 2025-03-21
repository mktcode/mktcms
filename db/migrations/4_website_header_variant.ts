import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('websites')
    .addColumn('headerVariant', 'integer')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('websites')
    .dropColumn('headerVariant')
    .execute()
}