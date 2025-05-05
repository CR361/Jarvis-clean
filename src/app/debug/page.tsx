import { getInvoiceById } from "@/lib/getInvoiceById";

export default async function DebugPage() {
  const invoice = await getInvoiceById("hier-een-bestaande-id");

  return (
    <pre className="text-white">
      {JSON.stringify(invoice, null, 2)}
    </pre>
  );
}
