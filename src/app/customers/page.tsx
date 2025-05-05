"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCustomers, deleteCustomer } from "@/lib/data"; // Zorg ervoor dat deleteCustomer geïmplementeerd is in je lib/data

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("Fout bij ophalen klanten:", error);
      }
    };
    fetchCustomers();
  }, []);

  const handleCustomerClick = (id: string) => {
    router.push(`/customers/${id}`);
  };

  const handleDeleteCustomer = async (id: string) => {
    const confirmed = window.confirm("Weet je zeker dat je deze klant wilt verwijderen?");
    if (confirmed) {
      try {
        await deleteCustomer(id);
        setCustomers(customers.filter((customer) => customer.id !== id));
      } catch (error) {
        console.error("Fout bij verwijderen klant:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Klanten</h1>
        <Button className="custom-button" asChild>
          <Link href="/customers/new">Nieuwe Klant</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Klanten Overzicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Naam</TableHead>
                  <TableHead>Bedrijfsnaam</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Telefoon</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      Geen klanten gevonden
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.company}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleCustomerClick(customer.id)}
                          >
                            Bekijken
                          </Button>
                          <button
                            className="delete-button text-sm px-4 py-2 rounded-md"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            Verwijderen
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
