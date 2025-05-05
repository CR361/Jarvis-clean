import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { Stats } from "@/lib/types"

interface InvoiceStatusProps {
  stats: Stats
}

export default function InvoiceStatus({ stats }: InvoiceStatusProps) {
  const totalAmount = stats.invoices.amount.total
  const paidAmount = stats.invoices.amount.paid
  const overdueAmount = stats.invoices.amount.overdue
  const pendingAmount = totalAmount - paidAmount - overdueAmount

  const paidPercentage = Math.round((paidAmount / totalAmount) * 100) || 0
  const overduePercentage = Math.round((overdueAmount / totalAmount) * 100) || 0
  const pendingPercentage = 100 - paidPercentage - overduePercentage

  return (
    <Card>
      <CardHeader>
        <CardTitle>Factuur Status</CardTitle>
        <CardDescription>Overzicht van betaalde en openstaande facturen.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="mr-4 h-2 w-2 rounded-full bg-green-500" />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="text-sm font-medium">Betaald</p>
                <p className="text-sm font-medium">{formatCurrency(paidAmount)}</p>
              </div>
              <p className="text-xs text-muted-foreground">{paidPercentage}% van totaal</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-4 h-2 w-2 rounded-full bg-amber-500" />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="text-sm font-medium">In behandeling</p>
                <p className="text-sm font-medium">{formatCurrency(pendingAmount)}</p>
              </div>
              <p className="text-xs text-muted-foreground">{pendingPercentage}% van totaal</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-4 h-2 w-2 rounded-full bg-red-500" />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="text-sm font-medium">Te laat</p>
                <p className="text-sm font-medium">{formatCurrency(overdueAmount)}</p>
              </div>
              <p className="text-xs text-muted-foreground">{overduePercentage}% van totaal</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
