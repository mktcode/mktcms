import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .addColumn('balance', 'decimal(10, 2)', (col) => col.notNull().defaultTo(0))
    .addColumn('price', 'decimal(10, 2)', (col) => col.notNull().defaultTo(0))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .dropColumn('balance')
    .dropColumn('price')
    .execute()
}