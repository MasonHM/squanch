import { ReactElement } from "react";
import styles from "./leaderboard.module.scss";
import { LiftArray, WeightMap } from "@/lib/google-sheets";
import SortSelector from "./sort-selector";
import LeaderboardTitle from "./leaderboard-title";
import { LiftLeaderboardData, WeightLeaderboardData } from "./leaderboard-data";

export type LeaderboardData = {
  name: string;
  weight: number;
  lift: number;
}[];

interface Props {
  title: string;
  data: LiftArray | WeightMap;
}

export default function Leaderboard({ title, data }: Props): ReactElement {
  let leaderboardData;
  if (Array.isArray(data)) {
    let liftData = data as LiftArray;
    leaderboardData = <LiftLeaderboardData data={liftData} />;
  } else {
    let weightData = data as WeightMap;
    leaderboardData = <WeightLeaderboardData data={weightData} />;
  }
  return (
    <div className={styles.leaderboard}>
      <LeaderboardTitle title={title} />
      <SortSelector />
      {leaderboardData}
    </div>
  );
}
