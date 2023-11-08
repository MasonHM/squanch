import { useEffect, useState } from "react";
import styles from "./data-update-modal.module.scss";

export default function DataUpdateModal({ updates }: { updates: string[] }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (updates.length != 0) {
      setVisible(true);
    }
  }, [updates]);
  return (
    <div className={`${styles.modal} ${visible ? styles.visible : ""}`} onClick={() => setVisible(false)}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <span className={styles.close} onClick={() => setVisible(false)}>
          &times;
        </span>
        <h2>ALERT:</h2>
        {[...updates].reverse().map((update, index) => (
          <p key={index}>{update}</p>
        ))}
      </div>
    </div>
  );
}
