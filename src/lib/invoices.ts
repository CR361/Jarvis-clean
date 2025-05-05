// File: lib/invoices.ts

// Supabase wordt alleen nog gebruikt voor creëren en ophalen – verwijderen gaat via API
import { createClientSideSupabaseClient } from "@/lib/supabase";

const supabase = createClientSideSupabaseClient();

// Haal alle klanten op
export async function getCustomers() {
  const { data, error } = await supabase.from("customers").select("*");

  if (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Fout bij ophalen klanten");
  }

  return data || [];
}

// Maak een nieuwe factuur aan (zonder items)
export async function createInvoice(invoiceData: {
  invoice_number: string;
  customer_id: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  amount_paid: number;
  is_paid: boolean;
  payment_date: string | null;
  notes: string;
}) {
  const { data, error } = await supabase
    .from("invoices")
    .insert([invoiceData])
    .select("*")
    .single();

  if (error || !data) {
    console.error("Error creating invoice:", error, data);
    throw new Error("Fout bij aanmaken factuur");
  }

  return data;
}

// Maak een nieuw factuur-item aan (los)
export async function createInvoiceItem(invoiceItemData: {
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
}) {
  const { data, error } = await supabase
    .from("invoice items")
    .insert([invoiceItemData])
    .select("*")
    .single();

  if (error || !data) {
    console.error("Error creating invoice item:", error, data);
    throw new Error("Fout bij aanmaken factuur-item");
  }

  return data;
}

// Maak factuur + items in één flow
export async function createInvoiceWithItems(invoiceData: {
  invoice_number: string;
  customer_id: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  amount_paid: number;
  is_paid: boolean;
  payment_date: string | null;
  notes: string;
  items: { description: string; quantity: number; unit_price: number }[];
}) {
  const { data: invoiceRes, error: invoiceErr } = await supabase
    .from("invoices")
    .insert([
      {
        invoice_number: invoiceData.invoice_number,
        customer_id: invoiceData.customer_id,
        issue_date: invoiceData.issue_date,
        due_date: invoiceData.due_date,
        total_amount: invoiceData.total_amount,
        amount_paid: invoiceData.amount_paid,
        is_paid: invoiceData.is_paid,
        payment_date: invoiceData.payment_date,
        notes: invoiceData.notes,
      },
    ])
    .select("id")
    .single();

  if (invoiceErr || !invoiceRes) {
    console.error("Error creating invoice:", invoiceErr, invoiceRes);
    throw new Error("Fout bij aanmaken factuur");
  }

  const invoiceId = invoiceRes.id;

  const itemsToInsert = invoiceData.items.map(item => ({
    invoice_id: invoiceId,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
  }));

  const { error: itemsErr } = await supabase
    .from("invoice items")
    .insert(itemsToInsert);

  if (itemsErr) {
    console.error("Error adding invoice items:", itemsErr);
    throw new Error("Fout bij aanmaken factuur-items");
  }

  return { id: invoiceId };
}

// Factuur updaten
export async function updateInvoice(
  invoiceId: string,
  updatedData: {
    invoice_number?: string;
    customer_id?: string;
    issue_date?: string;
    due_date?: string;
    total_amount?: number;
    amount_paid?: number;
    is_paid?: boolean;
    payment_date?: string | null;
    notes?: string;
  }
) {
  const { data, error } = await supabase
    .from("invoices")
    .update(updatedData)
    .eq("id", invoiceId)
    .select("*")
    .single();

  if (error || !data) {
    console.error("Error updating invoice:", error, data);
    throw new Error("Fout bij updaten factuur");
  }

  return data;
}

// Factuur verwijderen via API route
export async function deleteInvoice(invoiceId: string) {
  const res = await fetch(`/api/invoices/${invoiceId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Delete API error:", error);
    throw new Error("Fout bij verwijderen factuur via API");
  }

  return { success: true };
}

// Factuur-item verwijderen
export async function deleteInvoiceItem(itemId: string) {
  const { error } = await supabase
    .from("invoice items")
    .delete()
    .eq("id", itemId);

  if (error) {
    console.error("Error deleting invoice item:", error);
    throw new Error("Fout bij verwijderen factuur-item");
  }

  return { success: true };
}

