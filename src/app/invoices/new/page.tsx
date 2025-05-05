"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createInvoiceWithItems, getCustomers } from "@/lib/invoices";
import { Trash } from "lucide-react";
import Link from "next/link";
import "@/app/globals.css";

export default function NewInvoicePage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [issueDate, setIssueDate] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [invoiceItems, setInvoiceItems] = useState<any[]>([
    { description: "", quantity: 1, price: 0, vat: "21" },
  ]);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("Fout bij ophalen klanten:", error);
      }
    }
    fetchCustomers();

    const now = new Date();
    setIssueDate(now.toISOString().split("T")[0]);
    setDueDate(
      new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    );
    setInvoiceNumber(generateInvoiceNumber());
  }, []);

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const randomNumber = Math.floor(100 + Math.random() * 900);
    return `INV-${year}-${randomNumber}`;
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...invoiceItems];
    if (field === "quantity" || field === "price") {
      value = parseFloat(value) || (field === "quantity" ? 1 : 0);
    }
    if (field === "vat") value = value.toString();
    updated[index][field] = value;
    setInvoiceItems(updated);
  };

  const addInvoiceItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      { description: "", quantity: 1, price: 0, vat: "21" },
    ]);
  };

  const removeInvoiceItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !issueDate || !dueDate || invoiceItems.length === 0) {
      alert("Vul alle velden in.");
      return;
    }

    const totalAmount = invoiceItems.reduce((sum, item) => {
      const total = item.quantity * item.price;
      return sum + total + total * (parseFloat(item.vat) / 100);
    }, 0);

    const formattedItems = invoiceItems.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unit_price: item.price,
      vat: item.vat,
    }));

    const invoiceData = {
      invoice_number: invoiceNumber,
      customer_id: selectedCustomer,
      issue_date: issueDate,
      due_date: dueDate,
      notes,
      total_amount: totalAmount,
      amount_paid: 0,
      is_paid: false,
      payment_date: null,
      items: formattedItems,
    };

    try {
      await createInvoiceWithItems(invoiceData);
      // Navigeer eerst naar overzicht, daarna refresh
      router.push("/invoices");
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      console.error("Fout bij opslaan factuur:", error);
      alert(
        "Er ging iets mis bij het opslaan van de factuur. Zie de console voor details."
      );
    }
  };

  const calculateTotalAmount = () =>
    invoiceItems.reduce((sum, item) => {
      const total = item.quantity * item.price;
      return sum + total + total * (parseFloat(item.vat) / 100);
    }, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <i className="fas fa-file-invoice-dollar text-primary"></i>
        Nieuwe Factuur
      </h1>

      <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Klant kiezen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="customer" className="font-medium">
                Klant
              </label>
              <select
                id="customer"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Selecteer een klant</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="invoice-number" className="font-medium">
                Factuurnummer
              </label>
              <input
                id="invoice-number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="date" className="font-medium">
                Factuurdatum
              </label>
              <input
                id="date"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="due-date" className="font-medium">
                Vervaldatum
              </label>
              <input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Factuurregels */}
          <div className="space-y-2">
            <label className="font-medium">Factuurregels</label>
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="px-4 py-2 text-left">Omschrijving</th>
                    <th className="px-4 py-2 text-left">Aantal</th>
                    <th className="px-4 py-2 text-left">Prijs</th>
                    <th className="px-4 py-2 text-left">BTW</th>
                    <th className="px-4 py-2 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                          placeholder="Omschrijving"
                          className="w-full p-2 border rounded-md"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => handleItemChange(idx, "quantity", parseFloat(e.target.value))}
                          className="w-full p-2 border rounded-md"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={item.price}
                          min="0"
                          step="0.01"
                          onChange={(e) => handleItemChange(idx, "price", parseFloat(e.target.value))}
                          className="w-full p-2 border rounded-md"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={item.vat}
                          onChange={(e) => handleItemChange(idx, "vat", e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="0">0%</option>
                          <option value="9">9%</option>
                          <option value="21">21%</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => removeInvoiceItem(idx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" onClick={addInvoiceItem} className="custom-button mt-4">
              Regel Toevoegen
            </button>
          </div>

          {/* Totaalbedrag */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Totaalbedrag</span>
              <span>{calculateTotalAmount().toFixed(2)} EUR</span>
            </div>
          </div>

          {/* Notities */}
          <div className="space-y-2">
            <label htmlFor="notes" className="font-medium">Notities</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Actieknoppen */}
          <div className="flex justify-between items-center mt-6">
            <Link href="/invoices">
              <button type="button" className="custom-button outline">Annuleren</button>
            </Link>
            <button type="submit" className="custom-button">Opslaan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
