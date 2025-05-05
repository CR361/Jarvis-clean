import { getChecklistItems, getContractors, getCustomers, getInvoices, getEmails, getBackupHistory } from "./data"
import type { ChecklistItem, Contractor, Customer, Invoice, Email, Backup } from "./types"

// Checklist service
export async function fetchChecklistItems(): Promise<ChecklistItem[]> {
  return getChecklistItems()
}

export async function fetchChecklistItem(id: string): Promise<ChecklistItem | undefined> {
  const items = await getChecklistItems()
  return items.find((item) => item.id === id)
}

// Contractors service
export async function fetchContractors(): Promise<Contractor[]> {
  return getContractors()
}

export async function fetchContractor(id: string): Promise<Contractor | undefined> {
  const contractors = await getContractors()
  return contractors.find((contractor) => contractor.id === id)
}

// Customers service
export async function fetchCustomers(): Promise<Customer[]> {
  return getCustomers()
}

export async function fetchCustomer(id: string): Promise<Customer | undefined> {
  const customers = await getCustomers()
  return customers.find((customer) => customer.id === id)
}

// Invoices service
export async function fetchInvoices(): Promise<Invoice[]> {
  return getInvoices()
}

export async function fetchInvoice(id: string): Promise<Invoice | undefined> {
  const invoices = await getInvoices()
  return invoices.find((invoice) => invoice.id === id)
}

// Emails service
export async function fetchEmails(): Promise<Email[]> {
  return getEmails()
}

export async function fetchEmail(id: string): Promise<Email | undefined> {
  const emails = await getEmails()
  return emails.find((email) => email.id === id)
}

// Backup service
export async function fetchBackups(): Promise<Backup[]> {
  return getBackupHistory()
}
