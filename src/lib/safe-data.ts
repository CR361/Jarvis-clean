import * as dataFunctions from "./data"
import type { Customer, Invoice, Email, ChecklistItem, Contractor, Backup, BackupDetail } from "./types"

// Wrapper functies die nooit een error gooien
export async function getSafeCustomers(): Promise<Customer[]> {
  try {
    return await dataFunctions.getCustomers()
  } catch (error) {
    console.error("Error in getSafeCustomers:", error)
    return []
  }
}

export async function getSafeCustomer(id: string): Promise<Customer | undefined> {
  try {
    return await dataFunctions.getCustomer(id)
  } catch (error) {
    console.error(`Error in getSafeCustomer for id ${id}:`, error)
    return undefined
  }
}

export async function getSafeInvoices(): Promise<Invoice[]> {
  try {
    return await dataFunctions.getInvoices()
  } catch (error) {
    console.error("Error in getSafeInvoices:", error)
    return []
  }
}

export async function getSafeEmails(): Promise<Email[]> {
  try {
    return await dataFunctions.getEmails()
  } catch (error) {
    console.error("Error in getSafeEmails:", error)
    return []
  }
}

export async function getSafeChecklistItems(): Promise<ChecklistItem[]> {
  try {
    return await dataFunctions.getChecklistItems()
  } catch (error) {
    console.error("Error in getSafeChecklistItems:", error)
    return []
  }
}

export async function getSafeContractors(): Promise<Contractor[]> {
  try {
    return await dataFunctions.getContractors()
  } catch (error) {
    console.error("Error in getSafeContractors:", error)
    return []
  }
}

export async function getSafeChecklistItem(id: string): Promise<ChecklistItem | undefined> {
  try {
    return await dataFunctions.getChecklistItem(id)
  } catch (error) {
    console.error(`Error in getSafeChecklistItem for id ${id}:`, error)
    return undefined
  }
}

export async function getSafeContractor(id: string): Promise<Contractor | undefined> {
  try {
    return await dataFunctions.getContractor(id)
  } catch (error) {
    console.error(`Error in getSafeContractor for id ${id}:`, error)
    return undefined
  }
}

export async function getSafeBackupHistory(): Promise<Backup[]> {
  try {
    return await dataFunctions.getBackupHistory()
  } catch (error) {
    console.error("Error in getSafeBackupHistory:", error)
    return []
  }
}

export async function getSafeBackupDetail(timestamp: string): Promise<BackupDetail | null> {
  try {
    return await dataFunctions.getBackupDetail(timestamp)
  } catch (error) {
    console.error(`Error in getSafeBackupDetail for timestamp ${timestamp}:`, error)
    return null
  }
}

export async function getSafeStats() {
  try {
    return await dataFunctions.getStats()
  } catch (error) {
    console.error("Error in getSafeStats:", error)
    return {
      customers: { total: 0, new: 0 },
      invoices: { total: 0, overdue: 0, amount: { total: 0, paid: 0, overdue: 0 } },
      emails: { total: 0, sent: 0 },
      checklist: { total: 0, completed: 0, pending: 0 },
    }
  }
}
