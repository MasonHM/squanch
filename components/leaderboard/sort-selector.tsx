import {
  LeaderboardSortContext,
  LeaderboardSortContextData,
  LeaderboardSortMethod as SortMethod,
} from "@/lib/context-providers/sort-provider";
import { useContext } from "react";
import styles from "./leaderboard.module.scss";

export default function SortSelector() {
  const sortContext: LeaderboardSortContextData = useContext(LeaderboardSortContext);

  return (
    <>
      <span
        className={`${styles.selector} ${sortContext.sortMethod == SortMethod.weight ? styles.active : ""}`}
        onClick={() => sortContext.setSortMethod(SortMethod.weight)}
      >
        lb
      </span>
      &nbsp;/&nbsp;
      <span
        className={`${styles.selector} ${sortContext.sortMethod == SortMethod.percent ? styles.active : ""}`}
        onClick={() => sortContext.setSortMethod(SortMethod.percent)}
      >
        %
      </span>
    </>
  );
}
