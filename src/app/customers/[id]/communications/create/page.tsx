"use client"; // Dit is de manier om aan Next.js te zeggen: "dit is een client component"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getCustomer } from "@/lib/data"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface CreateCommunicationPageProps {
  params: {
    id: string
  }
}

export default async function CreateCommunicationPage({ params }: CreateCommunicationPageProps) {
  const customer = await getCustomer(params.id)

  if (!customer) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="fas fa-comment-alt text-primary me-2"></i>Nieuwe communicatie
        </h1>
        <Button variant="outline" asChild>
          <Link href={`/customers/${customer.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug naar klant
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm mb-4">
        <CardHeader>
          <CardTitle>Communicatie met {customer.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type communicatie *</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecteer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="phone">Telefoongesprek</SelectItem>
                    <SelectItem value="meeting">Vergadering</SelectItem>
                    <SelectItem value="other">Anders</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Datum *</Label>
                <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Onderwerp *</Label>
              <Input id="subject" placeholder="Onderwerp van de communicatie" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Inhoud *</Label>
              <Textarea id="content" placeholder="Beschrijf de inhoud van de communicatie" rows={6} />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" asChild>
                <Link href={`/customers/${customer.id}`}>Annuleren</Link>
              </Button>
              <Button type="submit">Opslaan</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
