import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function CustomerNotFound() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Klant niet gevonden</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">De opgevraagde klant kon niet worden gevonden.</p>
          <Button asChild>
            <Link href="/customers">Terug naar klanten</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
