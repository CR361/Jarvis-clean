import { getCustomers } from "@/lib/data"
import NewContractForm from "./newcontractform"

export default async function NewContractPage() {
  const customers = await getCustomers()

  return (
    <div className="space-y-6">
      <NewContractForm customers={customers} />
    </div>
  )
}
