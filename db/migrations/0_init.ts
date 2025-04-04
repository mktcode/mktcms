import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('domain', 'text')
    .addColumn('email', 'text')
    .addColumn('googleManagerId', 'text', (col) => col.notNull())
    .addColumn('password', 'text')
    .execute()
  
  await db.schema
    .createTable('companies')
    .addColumn('userId', 'integer', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('street', 'text')
    .addColumn('zip', 'text')
    .addColumn('city', 'text')
    .addColumn('phone', 'text')
    .addColumn('email', 'text')
    .addColumn('vat', 'text')
    .addColumn('logo', 'text')
    .addColumn('isSmallBusiness', 'boolean', (col) => col.notNull().defaultTo(1))
    .execute()
  
  await db.schema
    .createTable('vcards')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('userId', 'integer', (col) => col.notNull())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('subtitle', 'text')
    .addColumn('slogan', 'text')
    .addColumn('street', 'text')
    .addColumn('zip', 'text')
    .addColumn('city', 'text')
    .addColumn('phone', 'text')
    .addColumn('email', 'text')
    .addColumn('website', 'text')
    .addColumn('hasBack', 'boolean', (col) => col.notNull().defaultTo(0))
    .addColumn('backLogo', 'boolean', (col) => col.notNull().defaultTo(0))
    .addColumn('backTitle', 'text')
    .addColumn('backText', 'text')
    .execute()

  await db.schema
    .createTable('websites')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('userId', 'integer', (col) => col.notNull())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('subtitle', 'text')
    .addColumn('description', 'text')
    .addColumn('domain', 'text')
    .addColumn('path', 'text')
    .addColumn('image', 'text')
    .addColumn('isOnline', 'boolean', (col) => col.notNull().defaultTo(0))
    .addColumn('hasContactForm', 'boolean', (col) => col.notNull().defaultTo(0))
    .addColumn('contactFormSubject', 'text')
    .addColumn('showContents', 'boolean', (col) => col.notNull().defaultTo(0))
    .addColumn('primaryColor', 'text')
    .execute()
  
  await db.schema
    .createTable('websiteContents')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('websiteId', 'integer', (col) => col.notNull())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('subtitle', 'text')
    .addColumn('description', 'text')
    .addColumn('date', 'timestamp')
    .addColumn('url', 'text')
    .addColumn('image', 'text')
    .addColumn('orderIndex', 'integer', (col) => col.notNull().defaultTo(0))
    .execute()

  await db.schema
    .createTable('contactFormMessages')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('websiteId', 'integer', (col) => col.notNull())
    .addColumn('firstname', 'text', (col) => col.notNull())
    .addColumn('lastname', 'text', (col) => col.notNull())
    .addColumn('phone', 'text')
    .addColumn('email', 'text')
    .addColumn('message', 'text', (col) => col.notNull())
    .addColumn('date', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute()
  
  await db.schema
    .createTable('customers')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('userId', 'integer', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('address', 'text')
    .addColumn('zip', 'text')
    .addColumn('city', 'text')
    .addColumn('phone', 'text')
    .addColumn('email', 'text')
    .execute()
  
  await db.schema
    .createTable('suppliers')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('userId', 'integer', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('address', 'text')
    .addColumn('zip', 'text')
    .addColumn('city', 'text')
    .addColumn('phone', 'text')
    .addColumn('email', 'text')
    .execute()
  
  await db.schema
    .createTable('invoicesOut')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('customerId', 'integer', (col) => col.notNull())
    .addColumn('date', 'timestamp')
    .addColumn('status', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('discount', 'decimal', (col) => col.notNull().defaultTo(0))
    .execute()
  
  await db.schema
    .createTable('invoicesIn')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('supplierId', 'integer', (col) => col.notNull())
    .addColumn('date', 'timestamp')
    .addColumn('status', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('discount', 'decimal', (col) => col.notNull().defaultTo(0))
    .execute()
  
  await db.schema
    .createTable('invoiceItems')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('price', 'decimal', (col) => col.notNull())
    .addColumn('unit', 'text')
    .execute()
  
  await db.schema
    .createTable('invoiceItemRelations')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('invoiceId', 'integer', (col) => col.notNull())
    .addColumn('itemId', 'integer', (col) => col.notNull())
    .addColumn('quantity', 'integer', (col) => col.notNull().defaultTo(1))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute()
  await db.schema.dropTable('companies').execute()
  await db.schema.dropTable('vcards').execute()
  await db.schema.dropTable('websites').execute()
  await db.schema.dropTable('websiteContents').execute()
  await db.schema.dropTable('contactFormMessages').execute()
  await db.schema.dropTable('customers').execute()
  await db.schema.dropTable('suppliers').execute()
  await db.schema.dropTable('invoicesOut').execute()
  await db.schema.dropTable('invoicesIn').execute()
  await db.schema.dropTable('invoiceItems').execute()
  await db.schema.dropTable('invoiceItemRelations').execute()
}