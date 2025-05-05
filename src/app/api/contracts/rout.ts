// api/contracts/route.ts
import { NextResponse } from "next/server";
import { getContracts } from "@/lib/data";

export async function GET() {
  try {
    const contracts = await getContracts();
    return NextResponse.json(contracts);
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return NextResponse.json({ error: "Fout bij ophalen contracten" }, { status: 500 });
  }
}
