import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('websites')
    .addColumn('showAbout', 'boolean')
    .addColumn('aboutTitle', 'text')
    .addColumn('aboutSubtitle', 'text')
    .addColumn('aboutText', 'text')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('websites')
    .dropColumn('showAbout')
    .dropColumn('aboutTitle')
    .dropColumn('aboutSubtitle')
    .dropColumn('aboutText')
    .execute()
}