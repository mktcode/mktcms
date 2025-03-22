import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('invoiceItemRelations')
    .addColumn('price', 'decimal', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('invoiceItemRelations')
    .dropColumn('price')
    .execute()
}