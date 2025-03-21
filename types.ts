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
  website: z.string().optional(),
  hasBack: z.boolean(),
  backLogo: z.boolean(),
  backTitle: z.string().optional(),
  backText: z.string().optional(),
})

// Websites
export interface WebsitesTable {
  id: Generated<number>
  userId: number
  title: string
  subtitle: string | null
  description: string | null
  domain: string | null
  path: string | null
  image: string | null
  isOnline: boolean
  hasContactForm: boolean
  contactFormSubject: string | null
  font: string | null
  showAbout: boolean
  aboutImage: string | null
  aboutTitle: string | null
  aboutSubtitle: string | null
  aboutText: string | null
  showContents: boolean
  primaryColor: string | null
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
  path: z.string().optional(),
  image: z.string().optional(),
  isOnline: z.boolean(),
  hasContactForm: z.boolean(),
  contactFormSubject: z.string().optional(),
  font: z.string().optional(),
  showAbout: z.boolean(),
  aboutImage: z.string().optional(),
  aboutTitle: z.string().optional(),
  aboutSubtitle: z.string().optional(),
  aboutText: z.string().optional(),
  showContents: z.boolean(),
  primaryColor: z.string().optional(),
})
export type NewWebsiteFormSuggestions = Partial<z.infer<typeof websiteFormSchema>>

// Website Contents
export interface WebsiteContentsTable {
  id: Generated<number>
  websiteId: number
  title: string
  subtitle: string | null
  description: string | null
  date: ColumnType<string, string, string> | null
  url: string | null
  image: string | null
  orderIndex: number
}
export type WebsiteContent = Selectable<WebsiteContentsTable>
export type NewWebsiteContent = Insertable<WebsiteContentsTable>
export type WebsiteContentUpdate = Updateable<WebsiteContentsTable>
export const websiteContentFormSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, 'Ein Titel wird benötigt'),
  subtitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  orderIndex: z.number(),
})

// Contact Form
export interface ContactFormMessagesTable {
  id: Generated<number>
  websiteId: number
  firstname: string
  lastname: string
  phone: string | null
  email: string | null
  message: string
  date: ColumnType<string, undefined>
}
export type ContactFormMessage = Selectable<ContactFormMessagesTable>
export type NewContactFormMessage = Insertable<ContactFormMessagesTable>
export const contactFormMessageSchema = z.object({
  id: z.number().optional(),
  websiteId: z.number(),
  firstname: z.string().min(1, 'Ein Vorname wird benötigt'),
  lastname: z.string().min(1, 'Ein Nachname wird benötigt'),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  message: z.string().min(1, 'Eine Nachricht wird benötigt'),
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

// Invoices Out
export interface InvoicesOutTable {
  id: Generated<number>
  customerId: number
  date: ColumnType<string, string, string>
  status: number
  discount: number
}
export type InvoiceOut = Selectable<InvoicesOutTable>
export type NewInvoiceOut = Insertable<InvoicesOutTable>
export type InvoiceOutUpdate = Updateable<InvoicesOutTable>
export const invoiceOutFormSchema = z.object({
  id: z.number().optional(),
  customerId: z.number(),
  date: z.string(),
  status: z.number(),
  discount: z.number(),
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

// Invoices In
export interface InvoicesInTable {
  id: Generated<number>
  supplierId: number
  date: ColumnType<string, string, string>
  status: number
  discount: number
}
export type InvoiceIn = Selectable<InvoicesInTable>
export type NewInvoiceIn = Insertable<InvoicesInTable>
export type InvoiceInUpdate = Updateable<InvoicesInTable>
export const invoiceInFormSchema = z.object({
  id: z.number().optional(),
  supplierId: z.number(),
  date: z.string(),
  status: z.number(),
  discount: z.number(),
})

export interface Database {
  users: UsersTable
  companies: CompaniesTable
  vcards: VcardsTable
  websites: WebsitesTable
  websiteContents: WebsiteContentsTable
  contactFormMessages: ContactFormMessagesTable
  customers: CustomersTable
  suppliers: SuppliersTable
  invoicesOut: InvoicesOutTable
  invoiceItems: InvoiceItemsTable
  invoicesIn: InvoicesInTable
}