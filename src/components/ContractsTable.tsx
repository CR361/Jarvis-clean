import { FC } from "react";
import Link from "next/link";
import { Contract } from "@/lib/data";

interface ContractsTableProps {
  contracts: Contract[];
  onDelete: (id: string) => void;
}

const ContractsTable: FC<ContractsTableProps> = ({ contracts, onDelete }) => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="text-white">Contractnummer</th>
            <th className="text-white">Klant</th>
            <th className="text-white">Startdatum</th>
            <th className="text-white">Einddatum</th>
            <th className="text-white">Status</th>
            <th className="text-white">Tekenstatus</th>
            <th className="text-white">Verzonden op</th>
            <th className="text-white">Aangemaakt op</th>
            <th className="text-white w-[200px]">Acties</th>
          </tr>
        </thead>
        <tbody>
          {contracts.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-6 text-gray-400">
                Geen contracten gevonden
              </td>
            </tr>
          ) : (
            contracts.map((contract) => (
              <tr key={contract.id}>
                <td className="text-white">{contract.number}</td>
                <td className="text-white">{contract.customer}</td>
                <td className="text-white">
                  {contract.start_date
                    ? new Date(contract.start_date).toLocaleDateString("nl-NL")
                    : "-"}
                </td>
                <td className="text-white">
                  {contract.endDate
                    ? new Date(contract.endDate).toLocaleDateString("nl-NL")
                    : "Onbekend"}
                </td>
                <td className="text-white">
                  <span
                  >
<p className="font-medium capitalize">
  {
    contract.status === "draft"
      ? "Concept"
      : contract.status === "sent"
      ? "Verzonden"
      : null // Geen tekst als de status niet "concept" of "sent" is
  }
</p>


                  </span>
                </td>
                <td className="text-white capitalize">
                  {contract.signature_status
                    ? contract.signature_status
                    : "Niet ondertekend"}
                </td>
                <td className="text-white">
                  {contract.send_at
                    ? new Date(contract.send_at).toLocaleString("nl-NL")
                    : "-"}
                </td>
                <td className="text-white">
                  {contract.created_at
                    ? new Date(contract.created_at).toLocaleString("nl-NL")
                    : "-"}
                </td>
                <td className="text-white space-x-2 flex justify-start">
                  <Link href={`/contracts/${contract.id}`} passHref>
                    <button className="text-blue-500 hover:text-blue-700">
                      Bekijken
                    </button>
                  </Link>
                  <button
                    onClick={() => onDelete(contract.id)}
                    className="delete-button"
                  >
                    Verwijder
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ContractsTable;
