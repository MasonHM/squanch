import { getBunchData, getCachedLiftArrayDataOrFallback } from "@/lib/google-sheets";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const dummy = req.body; // treat this API as dynamic to update data
  return NextResponse.json(await getCachedLiftArrayDataOrFallback("bunch", getBunchData));
}
