import { ReactElement } from "react";
import styles from "./leaderboard.module.scss";
import { LiftData, WeightData } from "@/lib/google-sheets";

export type LeaderboardData = {
  name: string;
  weight: number;
  lift: number;
}[];

interface Props {
  title: string;
  active: boolean;
  data: WeightData | LiftData;
}

export default function Leaderboard({ title, active, data }: Props): ReactElement {
  return (
    <div className={`${styles.leaderboard} ${active ? styles.active : styles.inactive}`}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.data}>
        {data.map((datum, index) => (
          <p key={datum.name}>
            {index + 1}. {datum.name} - {"weight" in datum ? datum.weight : ""}
            {"lift" in datum ? datum.lift : ""} lbs
          </p>
        ))}
      </div>
    </div>
  );
}
