"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import supabaseClient from "@/lib/supabaseClient";

interface Customer {
  id?: string;
  name: string;
  company: string;
  kvk_number: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  notes: string;
}

interface CustomerFormProps {
  customer?: Customer;
  isEditing?: boolean;
}

export default function CustomerForm({ customer, isEditing = false }: CustomerFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const initialData: Customer = {
    id: customer?.id,
    name: customer?.name ?? "",
    company: customer?.company ?? "",
    kvk_number: customer?.kvk_number ?? "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? "",
    address: customer?.address ?? "",
    city: customer?.city ?? "",
    postal_code: customer?.postal_code ?? "",
    country: customer?.country ?? "",
    notes: customer?.notes ?? "",
  };

  const [formData, setFormData] = useState<Customer>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let error;
      if (isEditing && formData.id) {
        const { error: updateError } = await supabaseClient
          .from("customers")
          .update({
            name: formData.name,
            company: formData.company,
            kvk_number: formData.kvk_number,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postal_code: formData.postal_code,
            country: formData.country,
            notes: formData.notes,
          })
          .eq("id", formData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabaseClient
          .from("customers")
          .insert([{
            name: formData.name,
            company: formData.company,
            kvk_number: formData.kvk_number,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postal_code: formData.postal_code,
            country: formData.country,
            notes: formData.notes,
          }]);
        error = insertError;
      }

      if (error) {
        throw error;
      }

      toast({
        title: isEditing ? "Klant bijgewerkt" : "Klant aangemaakt",
        description: isEditing
          ? "De klantgegevens zijn succesvol bijgewerkt."
          : "De nieuwe klant is succesvol aangemaakt.",
      });

      router.push("/customers");
    } catch (err: any) {
      console.error("Error submitting form:", err);
      toast({
        title: "Fout bij opslaan",
        description: err.message || "Onbekende fout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Bedrijfsnaam</Label>
          <Input id="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Contactpersoon</Label>
          <Input id="company" value={formData.company} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="kvk_number">KvK Nummer</Label>
          <Input id="kvk_number" value={formData.kvk_number} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mailadres</Label>
          <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefoonnummer</Label>
          <Input id="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Adres</Label>
          <Input id="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Stad</Label>
          <Input id="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postal_code">Postcode</Label>
          <Input id="postal_code" value={formData.postal_code} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Land</Label>
          <Input id="country" value={formData.country} onChange={handleChange} required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notities</Label>
          <Textarea id="notes" value={formData.notes} onChange={handleChange} rows={5} />
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => router.push("/customers")} disabled={isLoading}>
          Annuleren
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Gegevens opslaan..." : "Opslaan"}
        </Button>
      </div>
    </form>
  );
}
