import { getAllData } from "@/lib/google-sheets";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(await getAllData());
}
