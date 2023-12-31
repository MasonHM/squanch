import { getAllData } from "@/lib/storage/google-sheets";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const dummy = req.body; // treat this API as dynamic to update data
  return NextResponse.json(await getAllData());
}
