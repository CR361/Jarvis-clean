import { createServerSupabaseClient } from "./supabase";
import type { Customer, emails, Invoice, Contract } from "./types";

// Data ophalen uit Supabase
export async function getCustomers() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.from("customers").select("*");

    if (error) {
      console.error("Error fetching customers:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getCustomers:", error);
    return [];
  }
}

export async function getCustomer(id: string): Promise<Customer | undefined> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.from("customers").select("*").eq("id", id).single();

    if (error || !data) {
      console.error("Error fetching customer:", error);
      return undefined;
    }

    return {
      id: data.id,
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone || "",
      address: data.address || "",
      city: data.city,
      postal_code: data.postal_code,
      country: data.country,
      notes: data.notes || "",
      createdAt: data.created_at,
      kvk_number: data.kvk_number,
    };
  } catch (error) {
    console.error("Error in getCustomer:", error);
    return undefined;
  }
}

export async function updateCustomer(id: string, updatedData: any) {
  try {
    const supabase = createServerSupabaseClient();

    // Eerst alle klanten ophalen
    const { data: customers, error: fetchError } = await supabase
      .from("customers")
      .select("*");

    if (fetchError) {
      throw new Error("Fout bij ophalen van klanten: " + fetchError.message);
    }

    // Zoek de klant die geüpdatet moet worden
    const customerToUpdate = customers?.find((c) => c.id === id);
    if (!customerToUpdate) {
      throw new Error("Klant niet gevonden");
    }

    // Voer de update uit
    const { error: updateError } = await supabase
      .from("customers")
      .update(updatedData)
      .match({ id });

    if (updateError) {
      throw new Error("Fout bij bijwerken klant: " + updateError.message);
    }

    return true;
  } catch (error) {
    console.error("Error in updateCustomer:", error);
    return false;
  }
}

export async function deleteCustomer(id: string) {
  try {
    const supabase = createServerSupabaseClient();

    // Verwijder klant
    const { error: deleteError } = await supabase.from("customers").delete().eq("id", id);
    if (deleteError) {
      console.error("Error deleting customer:", deleteError);
      return { success: false, message: "Er is een fout opgetreden bij het verwijderen van de klant." };
    }

    // Verwijder gerelateerde gegevens
    const relatedSteps = [
      { table: "invoices", message: "facturen" },
      { table: "contracts", message: "contracten" },
      { table: "creadifity_communications", message: "communicatie" },
    ];
    for (const step of relatedSteps) {
      const { error } = await supabase.from(step.table).delete().eq("customer_id", id);
      if (error) {
        console.error(`Error deleting ${step.message}:`, error);
        return { success: false, message: `Er is een fout opgetreden bij het verwijderen van de ${step.message}.` };
      }
    }

    return { success: true, message: "Klant succesvol verwijderd." };
  } catch (error) {
    console.error("Error in deleteCustomer:", error);
    return { success: false, message: "Er is een onbekende fout opgetreden." };
  }
}

// De overige fetch-functies (getInvoices, getContracts, getEmails, getInvoiceItems, getCustomerCommunications, getCustomerContracts) blijven onveranderd en maken gebruik van createServerSupabaseClient() op dezelfde wijze als hierboven.


// ... De rest van de functies (getInvoices, getContracts, getEmails, getInvoiceItems, getCustomerCommunications, getCustomerContracts) blijven ongewijzigd
// Om ruimte te besparen staan die hier niet herhaald, maar ze worden niet aangepast en blijven dus zoals jij ze stuurde.


// Get invoices
export async function getInvoices(): Promise<Invoice[]> {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase.from("invoices").select("*").order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching invoices:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    const { data: customers } = await supabase.from("customers").select("id, name");
    const customerMap = new Map();
    if (customers) {
      customers.forEach((customer) => {
        customerMap.set(customer.id, customer.name);
      });
    }

    const safeInvoices = data.map((invoice) => ({
      id: invoice.id,
      number: invoice.invoice_number || `INV-${Math.floor(Math.random() * 10000)}`,
      customerId: invoice.customer_id,
      customer: customerMap.get(invoice.customer_id) || "Onbekende klant",
      date: invoice.issue_date || new Date().toISOString(),
      dueDate: invoice.due_date || new Date().toISOString(),
      amount: typeof invoice.total_amount === "number" ? invoice.total_amount : 0,
      status: invoice.is_paid ? "paid" : "unpaid",
    }));

    return safeInvoices;
  } catch (error) {
    console.error("Error in getInvoices:", error);
    return [];
  }
}

export interface Contract {
  id: string;
  number: string;
  customer: string;
  customerId: string;
  title: string;
  content: string;
  created_at: string;
  start_date: string | null;
  endDate: string;
  signature_status: "signed" | "unsigned";
  signed_by: string | null;
  signed_at: string | null;
  signed_ip: string | null;
  send_at: string | null;
  status: "sent" | "draft";
}

/**
 * Haal een map van klant-id naar klantgegevens (zoals naam en email) op
 */
export async function getCustomerMap(): Promise<Map<string, { name: string, email: string }>> {
  const supabase = createServerSupabaseClient();
  try {
    const { data: customers, error } = await supabase
      .from("customers") // Zorg ervoor dat deze tabel correct is voor jouw klanten
      .select("id, name, email");

    if (error) {
      console.error("Error fetching customers:", error);
      return new Map();
    }

    // Maak een map van klant-id naar naam en email
    const customerMap = new Map();
    customers?.forEach((customer: any) => {
      customerMap.set(String(customer.id), { name: customer.name, email: customer.email });
    });

    return customerMap;
  } catch (err) {
    console.error("Unexpected error in getCustomerMap:", err);
    return new Map();
  }
}

/**
 * Haal alle contracten op, inclusief klantnaam en e-mail via getCustomerMap
 */
export async function getContracts(): Promise<Contract[]> {
  const supabase = createServerSupabaseClient();
  try {
    // 1. Ophalen raw contract data
    const { data: rows, error: fetchErr } = await supabase
      .from("creadifity contracten data")
      .select(
        "id, customer_id, title, content, status, start_date, end_date, created_at, signed_by, signed_at, signed_ip, signature_status, send_at"
      );
    if (fetchErr) {
      console.error("Error fetching contracts:", fetchErr);
      return [];
    }

    // 2. Haal klantnaam en email map op
    const customerMap = await getCustomerMap();

    // 3. Transform raw rows naar Contract[]
    const contracts: Contract[] = (rows || []).map((row: any) => {
      const customer = customerMap.get(String(row.customer_id)) || { name: "Onbekende klant", email: "" };

      return {
        id: String(row.id),
        number: row.title,
        customer: customer.name, // Gebruik de naam van de klant
        customerId: String(row.customer_id),
        email: customer.email,  // Voeg het e-mail adres toe aan het contract
        title: row.title,
        content: row.content,
        created_at: row.created_at,
        start_date: row.start_date,
        endDate: row.end_date || "",
        status: row.status,
        signed_by: row.signed_by,
        signed_at: row.signed_at,
        signed_ip: row.signed_ip,
        signature_status: row.signature_status,
        send_at: row.send_at
      };

    });

    // 4. Sorteer op created_at descending
    contracts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return contracts;
  } catch (err) {
    console.error("Unexpected error in getContracts:", err);
    return [];
  }
}

/**
 * Haal een specifiek contract op zonder gebruik van eq, door eerst alle op te halen en dan find
 */
export async function getContractById(contractId: string): Promise<Contract | null> {
  const contracts = await getContracts();
  return contracts.find(c => c.id === contractId) || null;
}

/**
 * Verwijder een contract door eerst op te halen en dan verwijderen via delete().match()
 */
export async function deleteContractById(contractId: string): Promise<Contract | null> {
  const supabase = createServerSupabaseClient();
  // 1) Vind contract
  const contract = await getContractById(contractId);
  if (!contract) throw new Error("Contract niet gevonden.");

  // 2) Verwijder record
  // Cast naar any voor .match()
  const query = (supabase
    .from("creadifity contracten data")
    .delete() as any);
  const { error } = await query.match({ id: contractId });
  if (error) {
    console.error("Error deleting contract:", error);
    throw new Error(error.message);
  }

  return contract;
}

// Definieer de interface voor een email
export interface Email {
  id: string;
  customer_id: string;
  subject: string;
  email_adress: string;
  content: string;
  status: 'sent' | 'concept';
  created_at: string;
  send_at: string | null;
}

export interface ParsedEmail {
  id: string;
  subject: string;
  recipient: string;
  email: string;
  created_at: string;
  updated_at: string;
  send_at: string | null;
  status: 'sent' | 'concept';
  opened: boolean;
}

export async function getEmails(): Promise<ParsedEmail[]> {
  try {
    const supabase = createServerSupabaseClient();

    // Haal de e-mails op uit Supabase
    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching emails:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('Geen e-mails gevonden');
      return [];
    }

    // Haal klanten op
    const { data: customers } = await supabase
      .from('customers')
      .select('id, name, email');

    const customerMap = new Map<string, { name: string; email: string }>();
    if (customers) {
      customers.forEach((customer) => {
        customerMap.set(customer.id, {
          name: customer.name,
          email: customer.email,
        });
      });
    }

    return data.map((email) => {
      const customer = customerMap.get(email.customer_id);

      // Verzeker dat created_at en optional send_at/updated_at strings zijn
      const createdAt =
        typeof email.created_at === 'string'
          ? email.created_at
          : new Date(email.created_at).toISOString();
      const sendAt = email.send_at
        ? typeof email.send_at === 'string'
          ? email.send_at
          : new Date(email.send_at).toISOString()
        : null;

      const updatedAt = email.updated_at
        ? typeof email.updated_at === 'string'
          ? email.updated_at
          : new Date(email.updated_at).toISOString()
        : createdAt;

      return {
        id: email.id,
        subject: email.subject || 'Geen onderwerp',
        recipient: customer?.name || 'Onbekende klant',
        email: email.email_adress || 'geen@email.com',
        created_at: createdAt,
        updated_at: updatedAt,
        send_at: sendAt,
        status: email.status || 'sent',
        opened: false,
      };
    });
  } catch (error) {
    console.error('Error in getEmails:', error);
    return [];
  }
}


// Get invoice items for a specific invoice
export async function getInvoiceItems(invoiceId: string) {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.from("invoice_items").select("*").eq("invoice_id", invoiceId);

    if (error) {
      console.error("Error fetching invoice items:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getInvoiceItems:", error);
    return [];
  }
}

// Get communications for a specific customer - aangepast om te werken zonder de creadifity_communications tabel
export async function getCustomerCommunications(customerId: string) {
  try {
    const supabase = createServerSupabaseClient();

    const { error: tableCheckError } = await supabase.from("creadifity_communications").select("count");

    if (!tableCheckError) {
      const { data, error } = await supabase
        .from("creadifity_communications")
        .select("*")
        .eq("customer_id", customerId)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching customer communications:", error);
        return [];
      }

      return data || [];
    }

    return [];
  } catch (error) {
    console.error("Error in getCustomerCommunications:", error);
    return [];
  }
}

// Get contracts for a specific customer - aangepast om te werken zonder de creadifity_contracten_data tabel
export async function getCustomerContracts(customerId: string) {
  try {
    const supabase = createServerSupabaseClient();

    const { error: tableCheckError } = await supabase.from("contracts").select("count");

    if (!tableCheckError) {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching customer contracts:", error);
        return [];
      }

      return data || [];
    }

    return [];
  } catch (error) {
    console.error("Error in getCustomerContracts:", error);
    return [];
  }
}
