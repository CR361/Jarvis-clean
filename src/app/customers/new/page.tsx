"use client"; // Dit zorgt ervoor dat deze pagina als client component werkt//
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CustomerForm from "@/components/customers/customer-form"

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nieuwe Klant</h1>

      <Card>
        <CardHeader>
          <CardTitle>Klantgegevens</CardTitle>
          <CardDescription>Vul de gegevens van de nieuwe klant in.</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerForm />
        </CardContent>
      </Card>
    </div>
  )
}
