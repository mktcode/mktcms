import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('invoiceItems')
    .addColumn('userId', 'integer')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('invoiceItems')
    .dropColumn('userId')
    .execute()
}