import { ReactNode } from "react";
import styles from "./footer.module.scss";

interface Props {
  startLoops: (() => void) | undefined;
  stopLoops: (() => void) | undefined;
  fasterLoops: (() => void) | undefined;
}

export default function Footer({ startLoops, stopLoops, fasterLoops }: Props): ReactNode {
  return (
    <div className={styles.footer}>
      <span onClick={stopLoops}>no want loop</span>
      &nbsp;/&nbsp;
      <span onClick={startLoops}>me want slow</span>
      &nbsp;/&nbsp;
      <span onClick={fasterLoops}>más rápido</span>
    </div>
  );
}
