"use client";
import { getFirebaseMessaging } from "@/lib/notifications/firebase-client";
import { Messaging, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";

export default function PushNotificationHandler() {
  const [messaging, setMessaging] = useState<Messaging>();
  useEffect(() => {
    setMessaging(getFirebaseMessaging());
  }, []);

  if (messaging) {
    onMessage(messaging, (payload) => {
      const notification = payload.notification;
      if (notification) {
        alert(`${notification.title} - ${notification.body}`);
      }
    });
  }

  return <></>;
}
