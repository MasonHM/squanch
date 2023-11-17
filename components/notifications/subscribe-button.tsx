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

  const updateToken = async () => {
    const token = localStorage.getItem("fcm-token") || "No token found";
    console.log("FCM Token: " + token);
    const swRegistrations = await navigator.serviceWorker.getRegistrations();
    let regUpdate = { title: "Service Worker (0)", body: "No service workers found" };
    if (swRegistrations.length > 0) {
      const firstReg = swRegistrations[0];
      regUpdate = {
        title: `Service Worker (${swRegistrations.length})`,
        body: `${firstReg.active?.state} -- ${firstReg.scope}`,
      };
    }
    setModalUpdates([{ title: "FCM Token", body: token }, regUpdate]);
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
