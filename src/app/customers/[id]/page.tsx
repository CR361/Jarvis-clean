import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import type { Invoice } from "@/lib/types";
import { getCustomer } from "@/lib/data";
import "@/app/globals.css";  

interface CustomerDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const supabase = createServerSupabaseClient();

  // Haal klantgegevens op
  const customer = await getCustomer(params.id);
  if (!customer) notFound();

  // Haal alle facturen op en filter client-side (geen .eq)
  const { data: allInvoices, error } = await supabase
    .from("invoices")
    .select("id, invoice_number, issue_date, total_amount, is_paid, customer_id");
  if (error) console.error("Error fetching invoices:", error);

  const invoiceRows = (allInvoices || [])
    .filter(row => String(row.customer_id) === params.id)
    .sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime());

  const invoices: Invoice[] = invoiceRows.map(row => ({
    id: row.id,
    number: row.invoice_number,
    customerId: params.id,
    customer: customer.name,
    date: row.issue_date,
    dueDate: row.issue_date,
    amount: row.total_amount,
    status: row.is_paid ? "paid" : "unpaid",
    items: [],
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4">
      {/* Titel en actieknoppen */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">{customer.name}</h1>
        <div className="flex gap-3">
          <Link href="/customers" className="custom-button text-sm">Terug naar klanten</Link>
          <Link href={`/customers/${customer.id}/edit`} className="custom-button text-sm">Bewerken</Link>
        </div>
      </div>

      {/* Klantgegevens */}
      <div className="rounded-md border p-6 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-6">Klantgegevens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Naam</h3>
            <p className="text-base">{customer.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Bedrijfsnaam</h3>
            <p className="text-base">{customer.company}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Kvk-nummer</h3>
            <p className="text-base">{customer.kvk_number}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">E-mailadres</h3>
            <p className="text-base">{customer.email}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Adres</h3>
            <p className="text-base">{customer.address}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Stad</h3>
            <p className="text-base">{customer.city}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Postcode</h3>
            <p className="text-base">{customer.postal_code}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Land</h3>
            <p className="text-base">{customer.country}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-600 mb-2">telefoonnummer</h3>
            <p className="text-base">{customer.phone}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Notities</h3>
            <p className="text-base">{customer.notes || "Geen notities"}</p>
          </div>
        </div>
      </div>

      {/* Facturen en Contracten in verticale secties */}
      <div className="rounded-md border p-6 shadow-sm bg-white flex flex-col space-y-14">
        {/* Facturen sectie */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Facturen</h3>
          <ul className="divide-y divide-gray-200">
            {invoices.length > 0 ? (
              invoices.map(inv => (
                <li key={inv.id} className="flex items-center justify-between py-5 text-sm">
                  <Link href={`/invoices/${inv.id}`} className="custom-buttoninvoice">{inv.number}</Link>
                  <span className="w-20 text-center">{new Date(inv.date).toLocaleDateString()}</span>
                  <span className="w-32 text-right">{formatCurrency(inv.amount)}</span>
                  <span className="w-24 text-center">{inv.status === "paid" ? "Betaald" : "Onbetaald"}</span>
                </li>
              ))
            ) : (
              <li className="py-6 text-center text-gray-400">Geen facturen gevonden</li>
            )}
          </ul>
          <div className="mt-4 flex justify-end">
            <Link href={`/invoices/new?customer=${customer.id}`} className="custom-button text-sm">Nieuwe Factuur</Link>
          </div>
        </div>

        {/* Contracten sectie met extra ruimte bovenaan */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Contracten</h3>
          <div className="text-left text-gray-400 py-6 pl-4">Geen contracten gevonden</div>
          <div className="flex justify-end">
            <Link href={`/contracts/new?customer=${customer.id}`} className="custom-button text-sm">Nieuw Contract</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
