"use client"

import { useState } from "react"
import type { ChecklistItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { Pencil, Trash } from "lucide-react"
import { toggleChecklistItem, deleteChecklistItem } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface ChecklistTableProps {
  items: ChecklistItem[]
}

export default function ChecklistTable({ items }: ChecklistTableProps) {
  const { toast } = useToast()
  const [optimisticItems, setOptimisticItems] = useState<ChecklistItem[]>(items)

  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setOptimisticItems((prev) => prev.map((item) => (item.id === id ? { ...item, isCompleted: !currentStatus } : item)))

    try {
      await toggleChecklistItem(id)
    } catch (error) {
      // Revert on error
      setOptimisticItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isCompleted: currentStatus } : item)),
      )

      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het bijwerken van het item.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je dit item wilt verwijderen?")) {
      return
    }

    // Optimistic update
    setOptimisticItems((prev) => prev.filter((item) => item.id !== id))

    try {
      await deleteChecklistItem(id)
      toast({
        title: "Succes",
        description: "Item succesvol verwijderd.",
      })
    } catch (error) {
      // Revert on error
      setOptimisticItems(items)
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het verwijderen van het item.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Status</TableHead>
            <TableHead>Beschrijving</TableHead>
            <TableHead>Aannemer</TableHead>
            <TableHead>Aangemaakt op</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {optimisticItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                Geen checklist items gevonden
              </TableCell>
            </TableRow>
          ) : (
            optimisticItems.map((item) => (
              <TableRow key={item.id} className={item.isCompleted ? "bg-muted/50" : ""}>
                <TableCell>
                  <Checkbox
                    checked={item.isCompleted}
                    onCheckedChange={() => handleToggleComplete(item.id, item.isCompleted)}
                  />
                </TableCell>
                <TableCell className={item.isCompleted ? "line-through text-muted-foreground" : ""}>
                  {item.description}
                </TableCell>
                <TableCell>{item.contractor?.name || "-"}</TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/checklist/item/${item.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
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
