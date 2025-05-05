"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createContractor, updateContractor, deleteContractor } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { Contractor } from "@/lib/types"

interface ContractorFormProps {
  contractor?: Contractor
  isEditing?: boolean
}

export default function ContractorForm({ contractor, isEditing = false }: ContractorFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: contractor?.name || "",
    email: contractor?.email || "",
    phone: contractor?.phone || "",
    specialty: contractor?.specialty || "",
    notes: contractor?.notes || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isEditing && contractor) {
        await updateContractor(contractor.id, formData)
        toast({
          title: "Aannemer bijgewerkt",
          description: "De aannemer is succesvol bijgewerkt.",
        })
      } else {
        await createContractor(formData)
        toast({
          title: "Aannemer toegevoegd",
          description: "De aannemer is succesvol toegevoegd.",
        })
      }
      router.push("/contractors")
    } catch (error) {
      toast({
        title: "Fout",
        description: `Er is een fout opgetreden bij het ${isEditing ? "bijwerken" : "toevoegen"} van de aannemer.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!contractor || !isEditing) return

    if (!confirm("Weet je zeker dat je deze aannemer wilt verwijderen?")) {
      return
    }

    setIsLoading(true)

    try {
      await deleteContractor(contractor.id)
      toast({
        title: "Aannemer verwijderd",
        description: "De aannemer is succesvol verwijderd.",
      })
      router.push("/contractors")
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het verwijderen van de aannemer.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Naam *</Label>
          <Input
            id="name"
            placeholder="Volledige naam"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialty">Specialiteit *</Label>
          <Input
            id="specialty"
            placeholder="Bijv. Elektricien, Loodgieter, etc."
            value={formData.specialty}
            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mailadres *</Label>
          <Input
            id="email"
            type="email"
            placeholder="E-mailadres"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefoonnummer *</Label>
          <Input
            id="phone"
            placeholder="Telefoonnummer"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notities</Label>
        <Textarea
          id="notes"
          placeholder="Extra informatie over deze aannemer"
          rows={4}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <div className="flex justify-between">
        {isEditing && (
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
            Verwijderen
          </Button>
        )}
        <div className={`flex gap-2 ${!isEditing && "ml-auto"}`}>
          <Button variant="outline" disabled={isLoading} type="button" onClick={() => router.push("/contractors")}>
            Annuleren
          </Button>
          <Button disabled={isLoading} type="submit">
            {isLoading ? "Bezig met opslaan..." : "Opslaan"}
          </Button>
        </div>
      </div>
    </form>
  )
}
