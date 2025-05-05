// Dit is een simulatie van een database service
// In een echte applicatie zou dit een verbinding met een database zijn

import type { Customer, Invoice, Email, ChecklistItem, Contractor, Backup } from "./types"
import { getCustomers, getInvoices, getEmails, getChecklistItems, getContractors, getBackupHistory } from "./data"

// In-memory database
let customers: Customer[] = []
let invoices: Invoice[] = []
let emails: Email[] = []
let checklistItems: ChecklistItem[] = []
let contractors: Contractor[] = []
let backups: Backup[] = []

// Initialize database with data
export async function initializeDatabase() {
  customers = await getCustomers()
  invoices = await getInvoices()
  emails = await getEmails()
  checklistItems = await getChecklistItems()
  contractors = await getContractors()
  backups = await getBackupHistory()
}

// Customer CRUD operations
export async function createCustomerInDb(customer: Omit<Customer, "id">): Promise<Customer> {
  const newCustomer = {
    ...customer,
    id: `cust-${customers.length + 1}`,
  }
  customers.push(newCustomer as Customer)
  return newCustomer as Customer
}

export async function updateCustomerInDb(id: string, customer: Partial<Customer>): Promise<Customer | null> {
  const index = customers.findIndex((c) => c.id === id)
  if (index === -1) return null

  const updatedCustomer = {
    ...customers[index],
    ...customer,
  }
  customers[index] = updatedCustomer
  return updatedCustomer
}

export async function deleteCustomerInDb(id: string): Promise<boolean> {
  const initialLength = customers.length
  customers = customers.filter((c) => c.id !== id)
  return customers.length < initialLength
}

// Invoice CRUD operations
export async function createInvoiceInDb(invoice: Omit<Invoice, "id">): Promise<Invoice> {
  const newInvoice = {
    ...invoice,
    id: `inv-${invoices.length + 1}`,
  }
  invoices.push(newInvoice as Invoice)
  return newInvoice as Invoice
}

// Checklist CRUD operations
export async function createChecklistItemInDb(item: Omit<ChecklistItem, "id" | "createdAt">): Promise<ChecklistItem> {
  const newItem = {
    ...item,
    id: `check-${checklistItems.length + 1}`,
    createdAt: new Date(),
  }
  checklistItems.push(newItem as ChecklistItem)
  return newItem as ChecklistItem
}

export async function updateChecklistItemInDb(id: string, item: Partial<ChecklistItem>): Promise<ChecklistItem | null> {
  const index = checklistItems.findIndex((c) => c.id === id)
  if (index === -1) return null

  const updatedItem = {
    ...checklistItems[index],
    ...item,
  }
  checklistItems[index] = updatedItem
  return updatedItem
}

// Contractor CRUD operations
export async function createContractorInDb(contractor: Omit<Contractor, "id">): Promise<Contractor> {
  const newContractor = {
    ...contractor,
    id: `cont-${contractors.length + 1}`,
  }
  contractors.push(newContractor as Contractor)
  return newContractor as Contractor
}

export async function updateContractorInDb(id: string, contractor: Partial<Contractor>): Promise<Contractor | null> {
  const index = contractors.findIndex((c) => c.id === id)
  if (index === -1) return null

  const updatedContractor = {
    ...contractors[index],
    ...contractor,
  }
  contractors[index] = updatedContractor
  return updatedContractor
}

export async function deleteContractorInDb(id: string): Promise<boolean> {
  const initialLength = contractors.length
  contractors = contractors.filter((c) => c.id !== id)
  return contractors.length < initialLength
}

// Initialize the database
initializeDatabase()
