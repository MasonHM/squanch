"use client";
import NotificationModal from "@/components/notifications/notification-modal";
import { getFirebaseMessaging, isFirebaseSupported } from "@/lib/notifications/firebase-client";
import { onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import { Update } from "../storage/data";

export default function PushNotificationHandler() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [notificationsSupported, setNotificationsSupported] = useState(false);

  useEffect(() => {
    const checkFirebaseSupport = async () => {
      setNotificationsSupported(await isFirebaseSupported());
    };

    checkFirebaseSupport();
  }, []);

  if (notificationsSupported) {
    const messaging = getFirebaseMessaging();

    onMessage(messaging, (payload) => {
      const notification = payload.notification;
      if (notification) {
        setUpdates([{ title: notification.title || "", body: notification.body || "" }, ...updates]);
      }
    });
  }

  return notificationsSupported ? <NotificationModal updates={updates} exitCallback={() => setUpdates([])} /> : <></>;
}
