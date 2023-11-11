"use client";
import { requestNotificationPermissions } from "@/lib/notifications/firebase-client";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";

export default function NotificationSignUp() {
  const [subscribed, setSubscribed] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (Notification.permission === "granted") {
      setSubscribed(true);
    } else {
      setSubscribed(false);
    }
    setLoaded(true);
  }, []);

  return (
    <div className={styles.content}>
      {loaded ? (
        subscribed ? (
          <p>U get nonch (hopefully...)</p>
        ) : (
          <button
            onClick={async () => {
              const permissionState = await requestNotificationPermissions();
              if (permissionState === "granted") {
                setSubscribed(true);
              }
            }}
          >
            Notify 4 chonkz
          </button>
        )
      ) : (
        <></>
      )}
    </div>
  );
}
