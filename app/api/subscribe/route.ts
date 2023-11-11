import { NextRequest, NextResponse } from "next/server";
import { App } from "firebase-admin/app";
import { Messaging, getMessaging } from "firebase-admin/messaging";
import { NOTIFICATION_TOPIC, customInitFirebase } from "@/lib/notifications/firebase-admin";

const app: App = customInitFirebase();
const messaging: Messaging = getMessaging(app);

export async function POST(req: NextRequest): Promise<NextResponse> {
  const res = await req.json();
  const registrationToken = res.token;
  console.log(`Subscribing ${registrationToken} to topic: ${NOTIFICATION_TOPIC}`);

  messaging
    .subscribeToTopic(registrationToken, NOTIFICATION_TOPIC)
    .then((response) => {
      console.log("Successfully subscribed to topic:", response);
    })
    .catch((error) => {
      console.log("Error subscribing to topic:", error);
    });

  return new NextResponse("Success", {
    status: 200,
  });
}
