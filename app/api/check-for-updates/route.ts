import { getAllData } from "@/lib/storage/google-sheets";
import { NextRequest, NextResponse } from "next/server";
import {
  CombinedData,
  Update,
  combineUpdatesSingleUpdate,
  findDifferencesBetweenCombinedData,
} from "@/lib/storage/data";
import { sendPushNotification } from "@/lib/notifications/firebase-admin";
import { getCombinedDataFromS3, putCombinedDataToS3 } from "@/lib/storage/s3";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const dummy = req.body; // treat this API as dynamic to update data
  console.log("Checking for updates...");

  const currentStats: CombinedData = await getAllData();
  const oldStats: CombinedData = await getCombinedDataFromS3();
  if (JSON.stringify(oldStats) !== JSON.stringify(currentStats)) {
    const updates: Update[] = findDifferencesBetweenCombinedData(oldStats, currentStats);
    console.log(`Updates found: ${JSON.stringify(updates)}`);
    await sendPushNotificationsForUpdates(updates);
    await putCombinedDataToS3(currentStats);
    return NextResponse.json({ updated: true, updates: updates });
  } else {
    console.log("No updates found.");
    return NextResponse.json({ updated: false });
  }
}

async function sendPushNotificationsForUpdates(updates: Update[]) {
  const combinedUpdate = combineUpdatesSingleUpdate(updates);
  await sendPushNotification(combinedUpdate.title, combinedUpdate.body);
}
