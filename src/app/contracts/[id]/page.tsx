"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getContractById } from "@/lib/data";
import { createClientSideSupabaseClient } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

const supabase = createClientSideSupabaseClient();

interface ContractDetailPageProps {
  params: { id: string };
}

export default function ContractDetailPage({ params }: ContractDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [contract, setContract] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const toastShown = useRef(false);

  useEffect(() => {
    if (!toastShown.current && searchParams.get("saved") === "true") {
      toast.success("Contract succesvol verzonden", { duration: 5000 });
      toastShown.current = true;
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      const data = await getContractById(params.id);
      if (!data) return router.push("/contracts");
      setContract(data);

      const { data: customerData, error } = await supabase
        .from("customers")
        .select("email")
        .eq("id", data.customerId)
        .single();

      if (error) {
        console.error("Fout bij ophalen klantgegevens:", error.message);
      } else {
        setCustomer(customerData);
      }

      setLoading(false);
    }
    fetchData();
  }, [params.id]);

  const handleSend = async () => {
    if (!contract) {
      toast.error("Contract ontbreekt");
      return;
    }

    if (!customer?.email) {
      toast.error("E-mailadres van klant ontbreekt");
      console.error("Geen e-mailadres beschikbaar:", customer);
      return;
    }

    setSending(true);
    console.log("Versturen naar:", customer.email);
    console.log("Verzenden met:", {
      to: customer.email,
      subject: `Contract ${contract.number}`,
      content: contract.content || "Er is een nieuw contract beschikbaar.",
    });

    try {
      const response = await fetch("/api/send-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: customer.email,
          subject: `Contract ${contract.number}`,
          content: contract.content || "Er is een nieuw contract beschikbaar.",
          contractId: contract.id, // 👈 toegevoegd
        }),
      });
    
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Fout bij verzenden e-mail:", errorText);
        throw new Error("Verzenden mislukt: " + errorText);
      }

      const { error: updateError } = await supabase
        .from("creadifity contracten data")
        .update({ status: "sent", send_at: new Date().toISOString() })
        .eq("id", contract.id);

      if (updateError) {
        console.error("Fout bij updaten status:", updateError.message);
        throw new Error("Fout bij updaten van status");
      }

      toast.success("Contract verzonden");
      // Verzend naar de contractpagina met een query parameter
      router.push("/contracts?saved=true");

    } catch (err: any) {
      console.error("Verzendfout:", err);
      toast.error(err.message || "Er ging iets mis");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p>Laden...</p>;
  if (!contract) return <p>Contract niet gevonden.</p>;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Contract {contract.number}
        </h1>
        <Link href="/contracts" className="custom-button">
          Terug naar contracten
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Algemene Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Contractnummer</p>
              <p className="font-medium">{contract.number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Klant</p>
              <p className="font-medium">{contract.customer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Startdatum</p>
              <p className="font-medium">
                {contract.start_date
                  ? new Date(contract.start_date).toLocaleDateString("nl-NL", {
                      timeZone: "Europe/Amsterdam",
                    })
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Einddatum</p>
              <p className="font-medium">
                {contract.endDate
                  ? new Date(contract.endDate).toLocaleDateString("nl-NL", {
                      timeZone: "Europe/Amsterdam",
                    })
                  : "Onbekend"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <p className="font-medium capitalize">
                {contract.status === "draft"
                  ? "Concept"
                  : contract.status === "sent"
                  ? "Verzonden"
                  : contract.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Aangemaakt op</p>
              <p className="font-medium">
                {contract.created_at
                  ? new Date(contract.created_at).toLocaleString("nl-NL", {
                      timeZone: "Europe/Amsterdam",
                    })
                  : "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border p-6 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4">Beschrijving</h2>
        <p className="whitespace-pre-wrap text-gray-800">
          {contract.content || "-"}
        </p>
      </div>

      {contract.status === "draft" && (
        <div className="flex gap-2">
          <Link
            href={`/contracts/${contract.id}/edit`}
            className="custom-button"
          >
            Bewerken
          </Link>
          <button
            onClick={handleSend}
            disabled={sending}
            className="custom-button bg-green-600 hover:bg-green-700"
          >
            {sending ? "Bezig..." : "Versturen"}
          </button>
        </div>
      )}
    </div>
  );
}
