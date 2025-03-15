import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import { z } from 'zod';

// Users
export interface UsersTable {
  id: Generated<number>
  name: string
  domain: string | null
  email: string | null
  googleManagerId: string
  password: string | null
  isOnline: boolean,
}
export type User = Selectable<UsersTable>
export type NewUser = Insertable<UsersTable>
export type UserUpdate = Updateable<UsersTable>

// Companies
export interface CompaniesTable {
  userId: number
  name: string
  street: string
  zip: string
  city: string
  phone: string | null
  email: string | null
  vat: string | null
  logo: string | null
  isSmallBusiness: boolean
}
export type Company = Selectable<CompaniesTable>
export type NewCompany = Insertable<CompaniesTable>
export type CompanyUpdate = Updateable<CompaniesTable>
export const companyFormSchema = z.object({
  name: z.string().min(1, 'Ein Name wird benötigt'),
  street: z.string().min(1, 'Eine Straße wird benötigt'),
  zip: z.string().min(1, 'Eine Postleitzahl wird benötigt'),
  city: z.string().min(1, 'Ein Ort wird benötigt'),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  vat: z.string().optional(),
  logo: z.string().optional(),
  isSmallBusiness: z.boolean(),
})

// Vcards
export interface VcardsTable {
  id: Generated<number>
  userId: number
  title: string
  subtitle: string | null
  slogan: string | null
  street: string | null
  zip: string | null
  city: string | null
  phone: string | null
  email: string | null
  website: string | null
  hasBack: boolean
  backLogo: boolean
  backTitle: string | null
  backText: string | null
}
export type Vcard = Selectable<VcardsTable>
export type NewVcard = Insertable<VcardsTable>
export type VcardUpdate = Updateable<VcardsTable>
export const vcardFormSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, 'Ein Titel wird benötigt'),
  subtitle: z.string().optional(),
  slogan: z.string().optional(),
  street: z.string().optional(),
  zip: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  hasBack: z.boolean(),
  backLogo: z.boolean(),
  backTitle: z.string().optional(),
  backText: z.string().optional(),
})

// Websites
// CREATE TABLE IF NOT EXISTS websites (
//   id INTEGER PRIMARY KEY AUTO_INCREMENT,
//   userId INTEGER NOT NULL,
//   title TEXT NOT NULL,
//   subtitle TEXT,
//   description TEXT,
//   domain TEXT,
//   image TEXT
// );
export interface WebsitesTable {
  id: Generated<number>
  userId: number
  title: string
  subtitle: string | null
  description: string | null
  domain: string | null
  image: string | null
}
export type Website = Selectable<WebsitesTable>
export type NewWebsite = Insertable<WebsitesTable>
export type WebsiteUpdate = Updateable<WebsitesTable>
export const websiteFormSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(1, 'Ein Titel wird benötigt')
    .max(100, 'Der Titel ist zu lang'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  domain: z.string().optional(),
  image: z.string().optional(),
})

// Customers
export interface CustomersTable {
  id: Generated<number>
  userId: number
  name: string
  address: string
  zip: string
  city: string
  phone: string | null
  email: string | null
}
export type Customer = Selectable<CustomersTable>
export type NewCustomer = Insertable<CustomersTable>
export type CustomerUpdate = Updateable<CustomersTable>
export const customerFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Ein Name wird benötigt'),
  address: z.string().min(1, 'Eine Adresse wird benötigt'),
  zip: z.string().min(1, 'Eine Postleitzahl wird benötigt'),
  city: z.string().min(1, 'Ein Ort wird benötigt'),
  phone: z.string().optional(),
  email: z.string().email().optional(),
})

// Suppliers
export interface SuppliersTable {
  id: Generated<number>
  userId: number
  name: string
  address: string
  zip: string
  city: string
  phone: string | null
  email: string | null
}
export type Supplier = Selectable<SuppliersTable>
export type NewSupplier = Insertable<SuppliersTable>
export type SupplierUpdate = Updateable<SuppliersTable>
export const supplierFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Ein Name wird benötigt'),
  address: z.string().min(1, 'Eine Adresse wird benötigt'),
  zip: z.string().min(1, 'Eine Postleitzahl wird benötigt'),
  city: z.string().min(1, 'Ein Ort wird benötigt'),
  phone: z.string().optional(),
  email: z.string().email().optional(),
})

// Invoices
export interface InvoicesTable {
  id: Generated<number>
  customerId: number
  date: ColumnType<string, string, string>
}
export type Invoice = Selectable<InvoicesTable>
export type NewInvoice = Insertable<InvoicesTable>
export type InvoiceUpdate = Updateable<InvoicesTable>
export const invoiceFormSchema = z.object({
  id: z.number().optional(),
  customerId: z.number(),
  date: z.string(),
  items: z.array(z.number()),
})

export interface InvoiceItemsTable {
  id: Generated<number>
  title: string
  description: string | null
  price: number
  unit: string | null
}
export type InvoiceItem = Selectable<InvoiceItemsTable>
export type NewInvoiceItem = Insertable<InvoiceItemsTable>
export type InvoiceItemUpdate = Updateable<InvoiceItemsTable>

// Content
export interface ContentsTable {
  id: Generated<number>
  userId: number
  parentId: number | null
  title: string
  subtitle: string | null
  description: string | null
  date: ColumnType<string, string, string> | null
  url: string | null
  image: string | null
  orderIndex: number
}
export type Content = Selectable<ContentsTable>
export type NewContent = Insertable<ContentsTable>
export type ContentUpdate = Updateable<ContentsTable>

export interface Database {
  users: UsersTable
  companies: CompaniesTable
  vcards: VcardsTable
  websites: WebsitesTable
  contents: ContentsTable
  customers: CustomersTable
  suppliers: SuppliersTable
  invoices: InvoicesTable
  invoiceItems: InvoiceItemsTable
}