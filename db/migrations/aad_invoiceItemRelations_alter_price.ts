import { Kysely, sql, UpdateResult } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  const query = sql`ALTER TABLE invoiceItemRelations CHANGE price price DECIMAL(10,2) NOT NULL;`
  await query.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  const query = sql`ALTER TABLE invoiceItemRelations CHANGE price price DECIMAL(10,0) NOT NULL;`
  await query.execute(db)
}