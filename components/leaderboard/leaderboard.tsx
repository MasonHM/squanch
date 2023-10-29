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
  data: WeightData | LiftData;
}

const COLORS = ["red", "orange", "yellow", "lime", "aqua", "blue", "magenta"];

export default function Leaderboard({ title, data }: Props): ReactElement {
  const shuffledColors = COLORS.map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  return (
    <div className={styles.leaderboard}>
      <h2 className={styles.title}>
        {title.split("").map((char, index) => (
          <span style={{ color: shuffledColors[index] }} key={char}>
            {char}
          </span>
        ))}
      </h2>
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
