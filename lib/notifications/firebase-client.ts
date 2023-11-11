import { FirebaseApp, initializeApp } from "firebase/app";
import { Messaging, getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBXNYY6DqNDA3tuNSlFqjyHcOuDnrcylpE",
  authDomain: "squanch.firebaseapp.com",
  projectId: "squanch",
  storageBucket: "squanch.appspot.com",
  messagingSenderId: "1090383879006",
  appId: "1:1090383879006:web:3c07c2f17311b98fc10dcf",
};

export function getFirebaseMessaging(): Messaging {
  const firebaseApp = customInitFirebase();
  return getMessaging(firebaseApp);
}

let app: FirebaseApp;
function customInitFirebase(): FirebaseApp {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
}

export async function requestNotificationPermissions() {
  console.log("Requesting notification permissions...");
  let resultPermission = "default";
  await Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      getToken(getFirebaseMessaging(), {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      }).then(async (firebaseToken) => {
        console.log("Notification permission granted: " + firebaseToken);
        localStorage.setItem("fcm-token", firebaseToken);
        const res = await fetch(`/api/subscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: firebaseToken }),
        });
      });
    }
    resultPermission = permission;
  });
  return resultPermission;
}
