// File: app/invoices/[id]/page.tsx
import { getInvoiceById } from "@/lib/getInvoiceById";
import { formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";
import InvoicePDFButton from "@/components/InvoicePDFButton";
import type { Invoice, InvoiceItem } from "@/lib/types";

interface InvoiceDetailPageProps {
  params: {
    id: string;
  };
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const data = await getInvoiceById(params.id);
  if (!data) return notFound();

  // Zorg dat items een lege array is als het niet gedefinieerd is
  const invoice: Invoice = {
    ...data,
    items: data.items ?? [],
  };

  return (
    <div className="invoice-detail space-y-6">
      <div className="invoice-header">
        <h1 className="text-3xl font-bold">Factuur {invoice.number}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <div><strong>Klant:</strong> {invoice.customer}</div>
          <div><strong>Datum:</strong> {new Date(invoice.date).toLocaleDateString()}</div>
          <div><strong>Vervaldatum:</strong> {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "n.v.t."}</div>
          <div><strong>Bedrag:</strong> {formatCurrency(invoice.amount)}</div>
          <div><strong>Status:</strong> {invoice.status === "paid" ? "Betaald" : "Onbetaald"}</div>
        </div>
      </div>

      <div className="invoice-items">
        <h2 className="text-2xl font-bold">Items</h2>
        {invoice.items.length > 0 ? (
          <table className="items-table mt-4 w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2">Beschrijving</th>
                <th className="text-left p-2">Aantal</th>
                <th className="text-left p-2">Prijs per stuk</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item: InvoiceItem) => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">{item.description}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">{formatCurrency(item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Geen items beschikbaar voor deze factuur.</p>
        )}
      </div>

      <div className="mt-6">
        <InvoicePDFButton invoice={invoice} />
      </div>
    </div>
  );
}
