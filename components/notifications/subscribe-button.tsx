import { requestNotificationPermissions } from "@/lib/notifications/firebase-client";
import Image from "next/image";
import Link from "next/link";
import styles from "./subscribe-button.module.scss";
import { useEffect, useState } from "react";
import { browserSupportsNotifications } from "@/lib/notifications/notification-handler";

export default function SubscribeButton() {
  const [subscribed, setSubscribed] = useState(false);
  const [notificationsSupported, setNotificationsSupported] = useState(false);

  useEffect(() => {
    const notifications = browserSupportsNotifications();
    setNotificationsSupported(notifications);
    if (notifications && Notification.permission === "granted") {
      setSubscribed(true);
    } else {
      setSubscribed(false);
    }
  }, []);

  return subscribed || !notificationsSupported ? (
    <></>
  ) : (
    <div className={styles.wrapper}>
      <div className={styles.subscribe}>
        <Link href="#">
          <Image
            src="/bell.png"
            alt="Think outside the bun."
            fill={true}
            className={styles.button}
            onClick={async () => {
              const permissionState = await requestNotificationPermissions();
              if (permissionState === "granted") {
                setSubscribed(true);
              }
            }}
          />
        </Link>
      </div>
    </div>
  );
}
