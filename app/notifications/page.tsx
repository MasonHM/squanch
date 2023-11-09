"use client";
import { enableNotifications, sendNotification } from "@/lib/notifications/notification-helper";
import styles from "./page.module.scss";

export default function NotificationSignUp() {
  const fetchData = async () => {
    const res = await fetch(`/api/combined`);
    const newData = await res.json();
  };

  return (
    <div className={styles.content}>
      <button onClick={enableNotifications}>Enable notifications</button>
      <br />
      <button onClick={() => sendNotification("ahhh")}>Send notification</button>
      <br />
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}
