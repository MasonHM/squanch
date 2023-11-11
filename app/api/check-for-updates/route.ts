import { getAllData } from "@/lib/storage/google-sheets";
import { NextRequest, NextResponse } from "next/server";
import { CombinedData, Update, findDifferencesBetweenCombinedData } from "@/lib/storage/data";
import { sendPushNotification } from "@/lib/notifications/firebase-admin";
import { getCombinedDataFromS3, putCombinedDataToS3 } from "@/lib/storage/s3";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const dummy = req.body; // treat this API as dynamic to update data

  const currentStats: CombinedData = await getAllData();
  const oldStats: CombinedData = await getCombinedDataFromS3();
  if (JSON.stringify(oldStats) !== JSON.stringify(currentStats)) {
    sendPushNotificationsForUpdates(oldStats, currentStats);
    await putCombinedDataToS3(currentStats);
    return NextResponse.json({ updated: true });
  } else {
    return NextResponse.json({ updated: false });
  }
}

function sendPushNotificationsForUpdates(oldData: CombinedData, currentData: CombinedData) {
  const updates: Update[] = findDifferencesBetweenCombinedData(oldData, currentData);
  for (let i = 0; i < updates.length; i++) {
    const update: Update = updates[i];
    sendPushNotification(update.title, update.body);
  }
}
