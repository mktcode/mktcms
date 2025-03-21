import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('websites')
    .addColumn('contactFormTitle', 'text')
    .addColumn('contactFormText', 'text')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('vcards')
    .dropColumn('contactFormTitle')
    .dropColumn('contactFormText')
    .execute()
}