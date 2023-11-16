import { isFirebaseSupported, requestNotificationPermissions } from "@/lib/notifications/firebase-client";
import Image from "next/image";
import Link from "next/link";
import styles from "./subscribe-button.module.scss";
import { useEffect, useState } from "react";
import NotificationModal from "./notification-modal";
import { Update } from "@/lib/storage/data";

export default function SubscribeButton() {
  const [subscribed, setSubscribed] = useState(false);
  const [notificationsSupported, setNotificationsSupported] = useState(false);
  const [modalUpdates, setModalUpdates] = useState<Update[]>([]);

  useEffect(() => {
    const checkFirebaseSupport = async () => {
      setNotificationsSupported(await isFirebaseSupported());
    };

    checkFirebaseSupport();
  }, []);

  useEffect(() => {
    if (notificationsSupported && Notification.permission === "granted") {
      setSubscribed(true);
    } else {
      setSubscribed(false);
    }
  }, [notificationsSupported]);

  const updateToken = () => {
    const token = localStorage.getItem("fcm-token") || "No token found";
    console.log("FCM Token: " + token);
    setModalUpdates([{ title: "FCM Token", body: token }]);
  };

  return !notificationsSupported ? (
    <></>
  ) : (
    <>
      <div className={styles.wrapper}>
        <div className={styles.subscribe}>
          <Link href="#">
            <Image
              src="/bell.png"
              alt="Think outside the bun."
              fill={true}
              className={styles.button}
              onClick={
                subscribed
                  ? () => {
                      updateToken();
                    }
                  : async () => {
                      const permissionState = await requestNotificationPermissions();
                      if (permissionState === "granted") {
                        setSubscribed(true);
                      }
                    }
              }
            />
          </Link>
        </div>
      </div>
      <NotificationModal
        updates={modalUpdates}
        exitCallback={() => {
          setModalUpdates([]);
        }}
      />
    </>
  );
}
