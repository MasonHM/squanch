import { ReactElement, ReactNode } from "react";
import styles from "./tabs.module.scss";

interface Props {
  children: ReactNode;
}

export default function TabGroup({ children }: Props): ReactElement {
  return <div className={styles["tab-group"]}>{children}</div>;
}
