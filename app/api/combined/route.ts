import { CombinedData } from "@/lib/storage/data";
import { getAllData } from "@/lib/storage/google-sheets";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const dummy = req.body; // treat this API as dynamic to update data
  const data: CombinedData = await getAllData();
  data.weightData["Mason"] = Math.round(Math.random() * 100) + 100;
  return NextResponse.json(data);
}
