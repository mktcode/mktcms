import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('companies')
    .addColumn('bankHolder', 'text')
    .addColumn('bankIban', 'text')
    .addColumn('bankBic', 'text')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('companies')
    .dropColumn('bankHolder')
    .dropColumn('bankIban')
    .dropColumn('bankBic')
    .execute()
}