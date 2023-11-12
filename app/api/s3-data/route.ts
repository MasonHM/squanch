import { NextRequest, NextResponse } from "next/server";
import { CombinedData } from "@/lib/storage/data";
import { getCombinedDataFromS3 } from "@/lib/storage/s3";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const dummy = req.body; // treat this API as dynamic to update data

  const oldStats: CombinedData = await getCombinedDataFromS3();
  return NextResponse.json(oldStats);
}
