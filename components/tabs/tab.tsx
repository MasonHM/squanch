import { MouseEventHandler, ReactElement } from "react";
import styles from "./tabs.module.scss";

interface Props {
  onClick: MouseEventHandler<HTMLDivElement>;
  active: boolean;
  label: string;
}

export default function Tab({ onClick, active = false, label }: Props): ReactElement {
  return (
    <>
      <div className={`${styles.tab} ${active ? styles.active : ""}`} onClick={onClick} tabIndex={0}>
        {label}
      </div>
    </>
  );
}
