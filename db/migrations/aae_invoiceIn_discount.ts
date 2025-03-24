import { Kysely, sql, UpdateResult } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('invoicesIn')
    .dropColumn('discount')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('invoicesIn')
    .addColumn('discount', 'decimal', (col) => col.notNull().defaultTo(0))
    .execute()
}