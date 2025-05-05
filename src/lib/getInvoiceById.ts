// File: lib/getInvoiceById.ts
import { createServerSupabaseClient } from "@/lib/supabase";
import { Invoice, InvoiceItem } from "@/lib/types";

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const supabase = createServerSupabaseClient();

  // Haal alle facturen op
  const { data: invoiceData, error: invoiceError } = await supabase
    .from("invoices")
    .select("*");

  if (invoiceError || !invoiceData) {
    console.error("Error fetching invoice data:", invoiceError);
    return null;
  }

  // Zoek juiste factuur
  const inv = invoiceData.find((item: any) => String(item.id) === id);
  if (!inv) {
    console.error("Factuur niet gevonden voor ID:", id);
    return null;
  }

  // Haal klantgegevens op
  const { data: customerData, error: customerError } = await supabase
    .from("customers")
    .select("id, name");

  if (customerError || !customerData) {
    console.error("Error fetching customer data:", customerError);
    return null;
  }

  const customer = customerData.find((cust: any) => cust.id === inv.customer_id);
  const customerName = customer?.name || "Onbekende klant";

  // Haal alle items op en filter handmatig op invoice_id (zonder .eq)
  const { data: itemsData, error: itemsError } = await supabase
    .from("invoice items")
    .select("id, invoice_id, description, quantity, unit_price");

  console.log("Opgehaald factuur ID:", id);
  console.log("itemsData uit Supabase:", itemsData);

  if (itemsError || !itemsData) {
    console.error("Error fetching invoice items:", itemsError);
    return null;
  }

  const items: InvoiceItem[] = itemsData
    .filter((item: any) => String(item.invoice_id) === id)
    .map((item: any) => ({
      id: item.id,
      invoiceId: item.invoice_id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unit_price,
    }));

  // Bouw Invoice object
  return {
    id: inv.id,
    number: inv.invoice_number,
    customer: customerName,
    date: inv.issue_date,
    amount: inv.total_amount,
    status: inv.is_paid ? "paid" : "unpaid",
    dueDate: inv.due_date || null,
    items,
  } as Invoice;
}
