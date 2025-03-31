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
  balance: number
  price: number
  createdAt: ColumnType<Date, undefined, undefined>
}
export type User = Selectable<UsersTable>
export type NewUser = Insertable<UsersTable>
export type UserUpdate = Updateable<UsersTable>

// Domains
export interface DomainsTable {
  id: Generated<number>
  userId: number
  domain: string
  authcode: string | null
}
export type Domain = Selectable<DomainsTable>
export type NewDomain = Insertable<DomainsTable>
export type DomainUpdate = Updateable<DomainsTable>
export const domainFormSchema = z.object({
  id: z.number().optional(),
  domain: z.string().min(1, 'Eine Domain wird benötigt'),
  authcode: z.string().nullable().optional(),
})

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
  bankHolder: string | null
  bankIban: string | null
  bankBic: string | null
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
  bankHolder: z.string().optional(),
  bankIban: z.string().optional(),
  bankBic: z.string().optional(),
})

// Vcards
export interface VcardsTable {
  id: Generated<number>
  userId: number
  image: string | null
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
  image: z.string().optional(),
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
  showMenu: boolean
  hasContactForm: boolean
  contactFormSubject: string | null
  contactFormTitle: string | null
  contactFormText: string | null
  headerVariant: number
  showAbout: boolean
  aboutImage: string | null
  aboutTitle: string | null
  aboutSubtitle: string | null
  aboutText: string | null
  showContents: boolean
  font: string | null
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
  showMenu: z.boolean(),
  hasContactForm: z.boolean(),
  contactFormSubject: z.string().optional(),
  contactFormTitle: z.string().optional(),
  contactFormText: z.string().optional(),
  headerVariant: z.number(),
  showAbout: z.boolean(),
  aboutImage: z.string().optional(),
  aboutTitle: z.string().optional(),
  aboutSubtitle: z.string().optional(),
  aboutText: z.string().optional(),
  showContents: z.boolean(),
  font: z.string().optional(),
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
  date: ColumnType<Date, string, string>
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
})

export interface InvoiceItemsTable {
  id: Generated<number>
  userId: number
  title: string
  description: string | null
  price: number
  unit: string | null
}
export type InvoiceItem = Selectable<InvoiceItemsTable>
export type NewInvoiceItem = Insertable<InvoiceItemsTable>
export type InvoiceItemUpdate = Updateable<InvoiceItemsTable>
export const invoiceItemFormSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(1, 'Ein Titel wird benötigt')
    .max(100, 'Der Titel ist zu lang'),
  description: z.string().optional(),
  price: z.number().min(0.01, 'Ein Preis wird benötigt'),
  unit: z.string().optional(),
})

export interface InvoiceItemRelationsTable {
  id: Generated<number>
  invoiceId: number
  itemId: number
  date: ColumnType<string, string, string>
  quantity: number
  price: number
}
export type InvoiceItemRelation = Selectable<InvoiceItemRelationsTable>
export type NewInvoiceItemRelation = Insertable<InvoiceItemRelationsTable>
export type InvoiceItemRelationUpdate = Updateable<InvoiceItemRelationsTable>
export const invoiceItemRelationFormSchema = z.object({
  id: z.number().optional(),
  itemId: z.number(),
  date: z.string(),
  quantity: z.number().min(1, 'Eine Menge wird benötigt'),
  price: z.number().min(0.01, 'Ein Preis wird benötigt'),
})
export type InvoiceOutWithItemRelations = InvoiceOut & { items: InvoiceItemRelation[] }

// Invoices In
export interface InvoicesInTable {
  id: Generated<number>
  supplierId: number
  date: ColumnType<Date, string, string>
  status: number
  amount: number
  vat: number
}
export type InvoiceIn = Selectable<InvoicesInTable>
export type NewInvoiceIn = Insertable<InvoicesInTable>
export type InvoiceInUpdate = Updateable<InvoicesInTable>
export const invoiceInFormSchema = z.object({
  id: z.number().optional(),
  supplierId: z.number(),
  date: z.string(),
  status: z.number(),
  amount: z.number().min(0.01, 'Ein Betrag wird benötigt'),
  vat: z.number(),
})

// Privacy
export interface PrivacyTable {
  id: Generated<number>
  userId: number
  needsOfficer: boolean
  officerName: string | null
  officerEmail: string | null
  officerPhone: string | null
  usesOfflineData: boolean
  offlineDataText: string | null
  usesOtherServiceProviders: boolean
  otherServiceProviders: string | null
}
export type Privacy = Selectable<PrivacyTable>
export type NewPrivacy = Insertable<PrivacyTable>
export type PrivacyUpdate = Updateable<PrivacyTable>
export const privacyFormSchema = z.object({
  id: z.number().optional(),
  needsOfficer: z.boolean(),
  officerName: z.string().nullable().optional(),
  officerEmail: z.string().email().nullable().optional(),
  officerPhone: z.string().nullable().optional(),
  usesOfflineData: z.boolean(),
  offlineDataText: z.string().nullable().optional(),
  usesOtherServiceProviders: z.boolean(),
  otherServiceProviders: z.array(z.object({
    name: z.string(),
    purpose: z.string(),
    dataTypes: z.string(),
    linkToPrivacyPolicy: z.string(),
  })),
})

export interface Database {
  users: UsersTable
  domains: DomainsTable
  companies: CompaniesTable
  vcards: VcardsTable
  websites: WebsitesTable
  websiteContents: WebsiteContentsTable
  contactFormMessages: ContactFormMessagesTable
  customers: CustomersTable
  suppliers: SuppliersTable
  invoicesOut: InvoicesOutTable
  invoiceItems: InvoiceItemsTable
  invoiceItemRelations: InvoiceItemRelationsTable
  invoicesIn: InvoicesInTable
}