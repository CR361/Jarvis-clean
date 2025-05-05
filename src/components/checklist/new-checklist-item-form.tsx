"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createChecklistItem } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { Contractor } from "@/lib/types"

interface NewChecklistItemFormProps {
  contractors: Contractor[]
}

export default function NewChecklistItemForm({ contractors }: NewChecklistItemFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    description: "",
    notes: "",
    contractorId: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await createChecklistItem(formData)
      toast({
        title: "Item toegevoegd",
        description: "Het checklist item is succesvol toegevoegd.",
      })
      router.push("/checklist")
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het toevoegen van het item.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Beschrijving *</Label>
        <Input
          id="description"
          placeholder="Beschrijving van het item"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notities</Label>
        <Textarea
          id="notes"
          placeholder="Extra informatie over dit item"
          rows={4}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contractor">Aannemer</Label>
        <Select
          value={formData.contractorId}
          onValueChange={(value) => setFormData({ ...formData, contractorId: value })}
        >
          <SelectTrigger id="contractor">
            <SelectValue placeholder="Selecteer een aannemer (optioneel)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Geen aannemer</SelectItem>
            {contractors.map((contractor) => (
              <SelectItem key={contractor.id} value={contractor.id}>
                {contractor.name} - {contractor.specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" disabled={isLoading} type="button" onClick={() => router.push("/checklist")}>
          Annuleren
        </Button>
        <Button disabled={isLoading} type="submit">
          {isLoading ? "Bezig met opslaan..." : "Opslaan"}
        </Button>
      </div>
    </form>
  )
}
