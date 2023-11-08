import { getAllData } from "@/lib/storage/google-sheets";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(await getAllData());
}
