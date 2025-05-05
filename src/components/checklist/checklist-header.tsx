import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle } from "lucide-react"

interface ChecklistHeaderProps {
  totalItems: number
  completedItems: number
  completionPercentage: number
}

export default function ChecklistHeader({ totalItems, completedItems, completionPercentage }: ChecklistHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Voortgang</h2>
              <p className="text-muted-foreground">
                {completedItems} van {totalItems} items voltooid
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex justify-between mb-2 text-sm">
              <span>{completionPercentage}% voltooid</span>
              <span>{totalItems - completedItems} resterend</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
