import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const invoiceId = params.id;

  // Verwijder eerst de gekoppelde items
  const { error: itemError } = await supabase
    .from("invoice items")
    .delete()
    .eq("invoice_id", invoiceId);

  if (itemError) {
    console.error("Fout bij verwijderen van items:", itemError);
    return new NextResponse("Fout bij verwijderen van items", { status: 500 });
  }

  // Verwijder daarna de factuur
  const { error: invoiceError } = await supabase
    .from("invoices")
    .delete()
    .eq("id", invoiceId);

  if (invoiceError) {
    console.error("Fout bij verwijderen van factuur:", invoiceError);
    return new NextResponse("Fout bij verwijderen van factuur", { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
