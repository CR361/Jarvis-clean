import { ReactNode } from "react"

export interface Customer {
  kvk_number: ReactNode
  id: string
  name: string
  company: string
  email: string
  phone: string
  address: string
  city: string
  postal_code: string 
  country: string 
  notes?: string
  createdAt?: string
}

export interface Invoice {
  id: string
  number: string
  customer: string
  customerId?: string
  date: string
  amount: number
  status: "paid" | "unpaid"
  dueDate: string
  items: InvoiceItem[];  // Zorg ervoor dat dit aanwezig is
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Contract {
  id: string
  number: string
  customer: string
  customerId?: string
  title?: string
  content?: string
  start_date: string
  signed_by: string
  signed_ip: string
  signed_at: string
  created_at: string
  endDate?: string
  status: "draft" | "sent" | "signed" | "rejected" | "ondertekend" | "verzonden"
}

export interface emails {
  id: string
  customer_id: string
  subject: string
  email_adress: string
  content: string
  status: "sent" | "concept"
  created_at: string
  send_at: string
  bestand_url: string
 
}

export interface Communication {
  id: string
  customerId: string
  type: string
  subject: string
  content: string
  date: string
}

export interface ChecklistItem {
  id: string
  description: string
  notes?: string
  isCompleted: boolean
  createdAt: string
  contractor?: Contractor | null
}

export interface Contractor {
  id: string
  name: string
  email: string
  phone: string
  specialty: string
  notes?: string
}

export interface CreateChecklistItemData {
  description: string
  notes?: string
  contractorId?: string | null
}

export interface UpdateChecklistItemData {
  description: string
  notes?: string
  isCompleted: boolean
  contractorId: string | null
}

export interface CreateContractorData {
  name: string
  email: string
  phone: string
  specialty: string
  notes?: string
}

export interface Backup {
  id: string
  timestamp: string
  date: string
  filename: string
  size: number
  type: string
}

export interface CreateBackupData {
  filename: string
  type: string
  includeCustomers: boolean
  includeInvoices: boolean
  includeContracts: boolean
}

export interface BackupFile {
  name: string
  type: string
  size: number
}

export interface BackupDetail extends Backup {
  files: BackupFile[]
  data: {
    customers: number
    invoices: number
    contracts: number
    emails: number
  }
  invoices: Invoice[]
  contracts: Contract[]
}

export interface Stats {
  customers: number
  invoices: number
  emails: number
  contracts: number
  checklist: number
}

export interface RecentActivity {
  id: string
  type: string
  description: string
  date: Date
}
