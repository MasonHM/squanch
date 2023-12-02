import { App, initializeApp, cert, getApps } from "firebase-admin/app";
import { Message, Messaging, getMessaging } from "firebase-admin/messaging";

const private_key = new (Buffer as any).from(process.env.FIREBASE_ADMIN_PRIVATE_KEY || "", "base64")
  .toString("ascii")
  .replace(/\\n/g, "\n");

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: private_key,
  }),
};

export const NOTIFICATION_TOPIC = process.env.NOTIFICATION_TOPIC || "squanchdates";

let app: App;
export function customInitFirebase(): App {
  if (!getApps().length) {
    app = initializeApp(firebaseAdminConfig);
  }
  return app;
}
customInitFirebase();

export async function sendPushNotification(title: string, body: string) {
  const message: Message = {
    webpush: {
      notification: {
        title: title,
        body: body,
        icon: "/favicon.ico",
      },
    },
    topic: NOTIFICATION_TOPIC,
  };

  const messaging: Messaging = getMessaging(app);
  await messaging
    .send(message)
    .then((response) => {
      console.log("Successfully sent push notification:", response);
    })
    .catch((error) => {
      console.log("Error sending push notification:", error);
    });
}
