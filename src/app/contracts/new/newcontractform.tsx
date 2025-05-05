"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { createClientSideSupabaseClient } from "@/lib/supabase"
import "@/app/globals.css"; 

// Supabase client (env variables loaded from .env.local)
const supabase = createClientSideSupabaseClient()

export default function NewContractForm({ customers }: { customers: { id: string; name: string }[] }) {
  const router = useRouter()
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [contractNumber, setContractNumber] = useState<string>(
    `CON-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  )
  const [description, setDescription] = useState<string>("")
  const [status, setStatus] = useState<string>("draft")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  useEffect(() => {
    const now = new Date()
    setStartDate(now.toISOString().split("T")[0])
    setEndDate(
      new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCustomer) {
      alert("Selecteer eerst een klant voordat je opslaat.")
      return
    }

    const payload = {
      customer_id: selectedCustomer,
      title: contractNumber,
      content: description,
      status,
      start_date: startDate,
      end_date: endDate,
      signing_url: "",
      signed_at: null,
      signed_by: null,
      created_at: new Date(),
    }

    try {
      const { data, error } = await supabase
        .from('creadifity contracten data')
        .insert([payload])
        .select(
          'id, customer_id, title, content, status, start_date, end_date, signing_url, signed_at, signed_by, created_at'
        )
        .single()

      if (error) {
        console.error("❌ Error inserting contract:", error)
        alert(`Fout bij opslaan: ${error.message}`)
        return
      }

      router.push('/contracts')
    } catch (err: any) {
      console.error("💥 Unexpected error during save:", err)
      alert(`Onverwachte fout: ${err.message}`)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Nieuw Contract</h1>
        <Link href="/contracts" className="custom-button">
          Terug naar contracten
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contractgegevens</CardTitle>
          <CardDescription>Vul de gegevens van het nieuwe contract in.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customer">Klant</Label>
                <select
                  id="customer"
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
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
                <Label htmlFor="contract-number">Contractnummer</Label>
                <Input
                  id="contract-number"
                  value={contractNumber}
                  onChange={(e) => setContractNumber(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-date">Startdatum</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">Einddatum</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Beschrijving</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschrijving van het contract"
                  rows={4}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/contracts" className="custom-button">
                Annuleren
              </Link>
              <Button type="submit">Opslaan</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
