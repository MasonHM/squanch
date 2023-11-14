"use client";
import NotificationModal from "@/components/notifications/notification-modal";
import { getFirebaseMessaging } from "@/lib/notifications/firebase-client";
import { onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";

export default function PushNotificationHandler() {
  const [updates, setUpdates] = useState<string[]>([]);
  const [notificationsSupported, setNotificationsSupported] = useState(false);

  useEffect(() => {
    const notifications = browserSupportsNotifications();
    setNotificationsSupported(notifications);
  }, []);

  if (notificationsSupported) {
    const messaging = getFirebaseMessaging();

    onMessage(messaging, (payload) => {
      const notification = payload.notification;
      if (notification) {
        setUpdates([`${notification.title} - ${notification.body}`, ...updates]);
      }
    });
  }

  return notificationsSupported ? <NotificationModal updates={updates} exitCallback={() => setUpdates([])} /> : <></>;
}

export function browserSupportsNotifications() {
  return "Notification" in window;
}
