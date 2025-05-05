"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBackup } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function BackupForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    filename: `backup_${new Date().toISOString().split("T")[0].replace(/-/g, "")}.zip`,
    type: "full",
    includeCustomers: true,
    includeInvoices: true,
    includeContracts: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await createBackup(formData)
      toast({
        title: "Backup succesvol aangemaakt",
        description: "De backup is succesvol aangemaakt en opgeslagen.",
      })
      router.push("/backup")
    } catch (error) {
      toast({
        title: "Fout bij aanmaken backup",
        description: "Er is een fout opgetreden bij het aanmaken van de backup.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="filename">Bestandsnaam</Label>
          <Input
            id="filename"
            placeholder="Bestandsnaam"
            value={formData.filename}
            onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type backup</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Selecteer type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Volledig</SelectItem>
              <SelectItem value="incremental">Incrementeel</SelectItem>
              <SelectItem value="differential">Differentieel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Backup opties</Label>
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="customers"
                checked={formData.includeCustomers}
                onCheckedChange={(checked) => setFormData({ ...formData, includeCustomers: !!checked })}
              />
              <Label htmlFor="customers">Klantgegevens</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="invoices"
                checked={formData.includeInvoices}
                onCheckedChange={(checked) => setFormData({ ...formData, includeInvoices: !!checked })}
              />
              <Label htmlFor="invoices">Facturen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="contracts"
                checked={formData.includeContracts}
                onCheckedChange={(checked) => setFormData({ ...formData, includeContracts: !!checked })}
              />
              <Label htmlFor="contracts">Contracten</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" disabled={isLoading} type="button" onClick={() => router.push("/backup")}>
          Annuleren
        </Button>
        <Button disabled={isLoading} type="submit">
          {isLoading ? "Bezig met aanmaken..." : "Backup Maken"}
        </Button>
      </div>
    </form>
  )
}
