export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]
export type Invoice = {
  id: string;
  number: string;
  customer: string;
  amount: number;
  date: string;
  status: 'paid' | 'unpaid';
};

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          email: string
          phone?: string
          address?: string
          created_at: string
          updated_at?: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string
          address?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          customer_id: string
          issue_date: string
          due_date: string
          total_amount: number
          amount_paid?: number
          is_paid: boolean
          payment_date?: string
          notes?: string
          created_at: string
          updated_at?: string
        }
        Insert: {
          id?: string
          invoice_number: string
          customer_id: string
          issue_date: string
          due_date: string
          total_amount: number
          amount_paid?: number
          is_paid?: boolean
          payment_date?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          customer_id?: string
          issue_date?: string
          due_date?: string
          total_amount?: number
          amount_paid?: number
          is_paid?: boolean
          payment_date?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          description: string
          quantity: number
          unit_price: number
        }
        Insert: {
          id?: string
          invoice_id: string
          description: string
          quantity: number
          unit_price: number
        }
        Update: {
          id?: string
          invoice_id?: string
          description?: string
          quantity?: number
          unit_price?: number
        }
      }
      creadifity_communications: {
        Row: {
          id: string
          customer_id: string
          type: string
          subject: string
          content: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          type: string
          subject: string
          content: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          type?: string
          subject?: string
          content?: string
          date?: string
          created_at?: string
        }
      }
      creadifity_contracten_data: {
        Row: {
          id: string
          customer_id: string
          title: string
          content: string
          status: string
          signing_url?: string
          signed_at?: string
          signed_by?: string
        }
        Insert: {
          id?: string
          customer_id: string
          title: string
          content: string
          status: string
          signing_url?: string
          signed_at?: string
          signed_by?: string
        }
        Update: {
          id?: string
          customer_id?: string
          title?: string
          content?: string
          status?: string
          signing_url?: string
          signed_at?: string
          signed_by?: string
        }
      }
      emails: {
        Row: {
          id: string
          subject: string
          recipient: string
          email: string
          date: string
          status: string
          opened: boolean
          created_at: string
        }
        Insert: {
          id?: string
          subject: string
          recipient: string
          email: string
          date: string
          status: string
          opened: boolean
          created_at?: string
        }
        Update: {
          id?: string
          subject?: string
          recipient?: string
          email?: string
          date?: string
          status?: string
          opened?: boolean
          created_at?: string
        }
      }
      checklist_items: {
        Row: {
          id: string
          description: string
          notes: string | null
          is_completed: boolean
          created_at: string
          contractor_id: string | null
        }
        Insert: {
          id?: string
          description: string
          notes?: string | null
          is_completed?: boolean
          created_at?: string
          contractor_id?: string | null
        }
        Update: {
          id?: string
          description?: string
          notes?: string | null
          is_completed?: boolean
          created_at?: string
          contractor_id?: string | null
        }
      }
      contractors: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          specialty: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          specialty: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          specialty?: string
          notes?: string | null
          created_at?: string
        }
      }
      backups: {
        Row: {
          id: string
          timestamp: string
          date: string
          filename: string
          size: number
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          timestamp: string
          date: string
          filename: string
          size: number
          type: string
          created_at?: string
        }
        Update: {
          id?: string
          timestamp?: string
          date?: string
          filename?: string
          size?: number
          type?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
