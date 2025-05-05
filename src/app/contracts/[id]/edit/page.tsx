
"use client"

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClientSideSupabaseClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

const supabase = createClientSideSupabaseClient();

export default function EditContractPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
  const [customer, setCustomer] = useState<string>("");
  const [contractNumber, setContractNumber] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("draft");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      const { data: custs } = await supabase.from('customers').select('id,name');
      setCustomers(custs || []);
      if (!id) return;
      const { data } = await supabase
        .from('creadifity contracten data')
        .select('*')
        .eq('id', id)
        .single();
      if (data) {
        setCustomer(data.customer_id);
        setContractNumber(data.title);
        setDescription(data.content || '');
        setStatus(data.status);
        setStartDate(data.start_date?.split('T')[0] || '');
        setEndDate(data.end_date?.split('T')[0] || '');
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) {
      toast.error("Selecteer een klant");
      return;
    }
  
    setLoading(true);
    const payload = {
      customer_id: customer,
      title: contractNumber,
      content: description,
      status,
      start_date: startDate,
      end_date: endDate,
    };
  
    const { error } = await supabase
      .from("creadifity contracten data")
      .update(payload)
      .eq("id", id!);
  
    setLoading(false);
  
    if (error) {
      toast.error("Fout bij bijwerken: " + error.message, { duration: 5000 });
    } else {
      // Géén toast hier — laat dat de detailpagina doen via ?saved=true
      router.push(`/contracts/${id}?saved=true`);
    }
  };
  

  if (loading) return <p>Laden...</p>;

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Contract Bewerken</h1>
          <Link href={`/contracts/${id}`} className="custom-button">
            Terug
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Contractgegevens</CardTitle>
            <CardDescription>Pas de contractgegevens aan en sla op.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Klant</Label>
                  <select
                    id="customer"
                    value={customer}
                    onChange={e => setCustomer(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Selecteer klant</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contract-number">Contractnummer</Label>
                  <Input
                    id="contract-number"
                    value={contractNumber}
                    onChange={e => setContractNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-date">Startdatum</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Einddatum</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Beschrijving</Label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Link href={`/contracts/${id}`} className="custom-button">Annuleren</Link>
                <Button type="submit">Opslaan</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

