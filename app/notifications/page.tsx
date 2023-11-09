"use client";
import { enableNotifications } from "@/lib/notifications/notification-helper";
import styles from "./page.module.scss";

export default function NotificationSignUp() {
  return (
    <div className={styles.content}>
      <button onClick={enableNotifications}>Enable notifications</button>
    </div>
  );
}
