import { MouseEventHandler, ReactElement } from "react";
import styles from "./tabs.module.scss";

interface Props {
  onClick: MouseEventHandler<HTMLDivElement>;
  selected: boolean;
  label: string;
}

export default function Tab({ onClick, selected = false, label }: Props): ReactElement {
  return (
    <>
      <div className={`${styles.tab} ${selected ? styles.selected : ""}`} onClick={onClick} tabIndex={0}>
        {label}
      </div>
    </>
  );
}
