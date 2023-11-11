import { NextRequest, NextResponse } from "next/server";
import { sendPushNotification } from "@/lib/notifications/firebase-admin";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const dummy = req.body; // treat this API as dynamic to update data

  sendPushNotification("Random Number", `${Math.round(Math.random() * 100)}`);

  return new NextResponse("Success", {
    status: 200,
  });
}
