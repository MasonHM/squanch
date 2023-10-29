import { ReactElement } from "react";
import styles from "./leaderboard.module.scss";
import { WeightData } from "@/lib/google-sheets";
import SortSelector from "./sort-selector";
import LeaderboardTitle from "./title";
import LeaderboardData from "./data";

export type LeaderboardData = {
  name: string;
  weight: number;
  lift: number;
}[];

interface Props {
  title: string;
  data: WeightData;
}

export default function Leaderboard({ title, data }: Props): ReactElement {
  return (
    <div className={styles.leaderboard}>
      <LeaderboardTitle title={title} />
      <SortSelector />
      <LeaderboardData data={data} />
    </div>
  );
}
