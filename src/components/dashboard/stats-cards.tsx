import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Users, FileText, Mail, CheckSquare } from "lucide-react"
import type { Stats } from "@/lib/types"

interface StatsCardsProps {
  stats: Stats
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Klanten</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.customers.total}</div>
          <p className="text-xs text-muted-foreground">{stats.customers.new} nieuwe deze maand</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Facturen</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.invoices.amount.total)}</div>
          <p className="text-xs text-muted-foreground">{stats.invoices.overdue} openstaande facturen</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">E-mails</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.emails.total}</div>
          <p className="text-xs text-muted-foreground">{stats.emails.sent} verzonden deze maand</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Checklist</CardTitle>
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.checklist.completed}/{stats.checklist.total}
          </div>
          <p className="text-xs text-muted-foreground">{stats.checklist.pending} openstaande taken</p>
        </CardContent>
      </Card>
    </div>
  )
}
