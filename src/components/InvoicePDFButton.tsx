"use client";

import { jsPDF } from "jspdf";
import { formatCurrency } from "@/lib/utils";
import type { InvoiceItem, Invoice } from "@/lib/types";

interface InvoicePDFButtonProps {
  invoice: Invoice;
}

export default function InvoicePDFButton({ invoice }: InvoicePDFButtonProps) {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Bedrijfsinformatie
    doc.setFontSize(16);
    doc.text("Creadifity", 20, 20);
    doc.setFontSize(10);
    doc.text("creadifitycontact@gmail.com", 20, 26);
    doc.text("KvK: 96597739", 20, 32);

    // Factuurgegevens
    doc.setFontSize(12);
    doc.text(`Factuurnummer: ${invoice.number}`, 150, 20);
    doc.text(`Datum: ${new Date(invoice.date).toLocaleDateString()}`, 150, 26);
    if (invoice.dueDate) {
      doc.text(`Vervaldatum: ${new Date(invoice.dueDate).toLocaleDateString()}`, 150, 32);
    }

    // Klantinformatie
    doc.setFontSize(12);
    doc.text("Factuur aan:", 20, 50);
    doc.text(invoice.customer, 20, 56);

    // Tabelkop
    let y = 70;
    doc.setFontSize(12);
    doc.text("Omschrijving", 20, y);
    doc.text("Aantal", 120, y);
    doc.text("Prijs/stuk", 150, y);
    doc.text("Totaal", 180, y);
    y += 6;

    doc.line(20, y, 200, y);
    y += 4;

    // Items
    invoice.items.forEach((item: InvoiceItem) => {
      doc.text(item.description, 20, y);
      doc.text(String(item.quantity), 120, y);
      doc.text(formatCurrency(item.unitPrice), 150, y);
      const total = item.quantity * item.unitPrice;
      doc.text(formatCurrency(total), 180, y);
      y += 8;
    });

    // Totaal
    y += 6;
    doc.line(150, y, 200, y);
    y += 6;
    doc.text("Totaalbedrag:", 150, y);
    doc.text(formatCurrency(invoice.amount), 180, y);

    // Status
    y += 10;
    doc.text(`Status: ${invoice.status === "paid" ? "Betaald" : "Onbetaald"}`, 20, y);

    doc.save(`${invoice.number}_factuur.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="px-4 py-2 bg-blue-600 text-white rounded-md"
    >
      Download Factuur als PDF
    </button>
  );
}
