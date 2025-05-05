import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateTime } from "@/lib/utils"
import { FileText, Mail, User, CheckSquare, FileCodeIcon as FileContract } from "lucide-react"
import type { RecentActivity } from "@/lib/types"

interface RecentActivitiesProps {
  activities: RecentActivity[]
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "customer":
        return <User className="h-4 w-4" />
      case "invoice":
        return <FileText className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "contract":
        return <FileContract className="h-4 w-4" />
      case "checklist":
        return <CheckSquare className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recente Activiteiten</CardTitle>
        <CardDescription>De laatste activiteiten in het systeem.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="mr-4 mt-0.5 rounded-full bg-primary/10 p-2 text-primary">{getIcon(activity.type)}</div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(activity.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
