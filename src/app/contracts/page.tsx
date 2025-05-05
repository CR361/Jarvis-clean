"use client";

import { useEffect, useState } from "react";
import { getContracts, deleteContractById } from "@/lib/data"; // Importeer deleteContractById
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import ContractsTable from "@/components/ContractsTable";
import { toast, Toaster } from "react-hot-toast"; // Importeer toast voor meldingen

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchContracts() {
      try {
        const data = await getContracts();
        setContracts(data);
      } catch (error) {
        console.error("Fout bij ophalen contracten:", error);
      }
    }

    fetchContracts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je dit contract wilt verwijderen?")) return;

    try {
      await deleteContractById(id);
      setContracts((prev) => prev.filter((contract) => contract.id !== id));
      toast.success("Contract succesvol verwijderd ✅"); // Vervang de alert door een toastmelding
    } catch (error) {
      console.error("Verwijderen mislukt:", error);
      toast.error("Verwijderen mislukt ❌"); // Vervang de alert door een toastmelding
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" /> {/* Plaats voor toastmeldingen */}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contracten</h1>
        <Link href="/contracts/new" className="custom-button">
          Nieuw Contract
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contracten Overzicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="contract-table-container">
            <ContractsTable contracts={contracts} onDelete={handleDelete} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
