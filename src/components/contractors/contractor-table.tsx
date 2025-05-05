"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash } from "lucide-react"
import { deleteContractor } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import type { Contractor } from "@/lib/types"

interface ContractorTableProps {
  contractors: Contractor[]
}

export default function ContractorTable({ contractors }: ContractorTableProps) {
  const { toast } = useToast()
  const [optimisticContractors, setOptimisticContractors] = useState<Contractor[]>(contractors)

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze aannemer wilt verwijderen?")) {
      return
    }

    // Optimistic update
    setOptimisticContractors((prev) => prev.filter((contractor) => contractor.id !== id))

    try {
      await deleteContractor(id)
      toast({
        title: "Aannemer verwijderd",
        description: "De aannemer is succesvol verwijderd.",
      })
    } catch (error) {
      // Revert on error
      setOptimisticContractors(contractors)
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het verwijderen van de aannemer.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Naam</TableHead>
            <TableHead>Specialiteit</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefoon</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {optimisticContractors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                Geen aannemers gevonden
              </TableCell>
            </TableRow>
          ) : (
            optimisticContractors.map((contractor) => (
              <TableRow key={contractor.id}>
                <TableCell className="font-medium">{contractor.name}</TableCell>
                <TableCell>{contractor.specialty}</TableCell>
                <TableCell>{contractor.email}</TableCell>
                <TableCell>{contractor.phone}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/contractors/${contractor.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(contractor.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
