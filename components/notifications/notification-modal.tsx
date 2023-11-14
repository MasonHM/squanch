import { useEffect, useState } from "react";
import styles from "./notification-modal.module.scss";

export default function NotificationModal({ updates, exitCallback }: { updates: string[]; exitCallback: () => void }) {
  const [visible, setVisible] = useState(false);

  const handleExit = () => {
    setVisible(false);
    exitCallback();
  };

  useEffect(() => {
    if (updates.length != 0) {
      setVisible(true);
    }
  }, [updates]);
  return (
    <div className={`${styles.modal} ${visible ? styles.visible : ""}`} onClick={handleExit}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.updates}>
          {updates.map((update, index) => (
            <>
              <p key={index}>{update}</p>
              {index !== updates.length - 1 ? <br /> : <></>}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
