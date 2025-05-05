 // Dit is de manier om aan Next.js te zeggen: "dit is een client component"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CustomerForm from "@/components/customers/customer-form"
import { getCustomer } from "@/lib/data"
import { notFound } from "next/navigation"

interface EditCustomerPageProps {
  params: {
    id: string
  }
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const customer = await getCustomer(params.id)

  if (!customer) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Klant Bewerken</h1>

      <Card>
        <CardHeader>
          <CardTitle>Klantgegevens</CardTitle>
          <CardDescription>Bewerk de gegevens van de klant.</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerForm customer={customer} isEditing={true} />
        </CardContent>
      </Card>
    </div>
  )
}
