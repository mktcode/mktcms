import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('websites')
    .addColumn('showMenu', 'boolean')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('websites')
    .dropColumn('showMenu')
    .execute()
}