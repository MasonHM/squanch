import styles from "./leaderboard.module.scss";
import { getShuffledColors } from "@/lib/colors/color-helper";

export default function LeaderboardTitle({ title }: { title: string }) {
  const shuffledColors = getShuffledColors();

  return (
    <h2 className={styles.title}>
      {title.split("").map((char, index) => (
        <span style={{ color: shuffledColors[index] }} key={char}>
          {char}
        </span>
      ))}
    </h2>
  );
}
