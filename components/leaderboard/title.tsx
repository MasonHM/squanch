import styles from "./leaderboard.module.scss";

const COLORS = ["red", "orange", "yellow", "lime", "aqua", "blue", "magenta"];

export default function LeaderboardTitle({ title }: { title: string }) {
  const shuffledColors = COLORS.map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

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
