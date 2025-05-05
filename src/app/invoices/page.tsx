"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getInvoices } from "@/lib/data";
import { deleteInvoice } from "@/lib/invoices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import "@/app/globals.css";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const data = await getInvoices();
        setInvoices(data);
      } catch (error) {
        console.error("Fout bij ophalen facturen:", error);
      }
    }

    fetchInvoices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze factuur wilt verwijderen?")) return;

    try {
      await deleteInvoice(id);
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
    } catch (error) {
      console.error("Verwijderen mislukt:", error);
      alert("Verwijderen mislukt");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Facturen</h1>
        <Link href="/invoices/new" className="custom-button">
          Nieuwe Factuur
        </Link>
      </div>

      <InvoicesTable invoices={invoices} onDelete={handleDelete} />
    </div>
  );
}

const InvoicesTable = ({
  invoices,
  onDelete,
}: {
  invoices: any[];
  onDelete: (id: string) => void;
}) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Facturen Overzicht</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-gray-700">
          <Table className="min-w-full divide-y divide-gray-700">
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Factuurnummer</TableHead>
                <TableHead className="text-white">Klant</TableHead>
                <TableHead className="text-white">Datum</TableHead>
                <TableHead className="text-white">Bedrag</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-400">
                    Geen facturen gevonden
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium text-white">{invoice.number}</TableCell>
                    <TableCell className="text-white">{invoice.customer}</TableCell>
                    <TableCell className="text-white">
                      {invoice.date
                        ? new Date(invoice.date).toLocaleDateString()
                        : "Geen datum"}
                    </TableCell>
                    <TableCell className="text-white">
                      {typeof invoice.amount === "number"
                        ? formatCurrency(invoice.amount)
                        : "€0,00"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          invoice.status === "paid"
                            ? "bg-green-600 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {invoice.status === "paid" ? "Betaald" : "Onbetaald"}
                      </span>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="custom-button"
                      >
                        Bekijken
                      </Link>
                      <button
                        onClick={() => onDelete(invoice.id)}
                        className="delete-button"
                      >
                        Verwijder
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
