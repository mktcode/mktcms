import { Kysely, sql, UpdateResult } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('invoicesIn')
    .addColumn('amount', 'decimal(10, 2)', (col) => col.notNull().defaultTo(0))
    .addColumn('vat', 'decimal(10, 2)', (col) => col.notNull().defaultTo(0))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('invoicesIn')
    .dropColumn('amount')
    .dropColumn('vat')
    .execute()
}