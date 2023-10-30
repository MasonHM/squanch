import { ChonkContext } from "@/lib/context-providers/chonk-provider";
import { LeaderboardSortContext, LeaderboardSortContextData, getSortFunc } from "@/lib/context-providers/sort-provider";
import { LiftArray, WeightMap } from "@/lib/google-sheets";
import { useContext } from "react";
import styles from "./leaderboard.module.scss";

export type LeaderBoardDatum = {
  name: string;
  weight: number;
  percentage?: number;
};

export function LiftLeaderboardData({ data }: { data: LiftArray }) {
  const weightData: WeightMap = useContext(ChonkContext);
  const leaderboardData: LeaderBoardDatum[] = calculateLiftData(data, weightData);
  const leaderboardSortContext: LeaderboardSortContextData = useContext(LeaderboardSortContext);
  const sortedData = leaderboardData.sort(getSortFunc(leaderboardSortContext.sortMethod));

  return <LeaderBoardList sortedDataArray={sortedData} />;
}

export function WeightLeaderboardData() {
  const weightData: WeightMap = useContext(ChonkContext);
  const leaderboardData: LeaderBoardDatum[] = calculateWeightData(weightData);
  const sortedData = leaderboardData.sort((a: LeaderBoardDatum, b: LeaderBoardDatum) => b.weight - a.weight);

  return <LeaderBoardList sortedDataArray={sortedData} />;
}

function LeaderBoardList({ sortedDataArray }: { sortedDataArray: LeaderBoardDatum[] }) {
  return (
    <div className={styles.data}>
      {sortedDataArray.map((datum, index) => {
        return (
          <LeaderBoardEntry
            place={index + 1}
            name={datum.name}
            weight={datum.weight}
            percentage={datum.percentage}
            key={index}
          />
        );
      })}
    </div>
  );
}

function LeaderBoardEntry({
  place,
  name,
  weight,
  percentage,
}: {
  place: number;
  name: string;
  weight: number;
  percentage?: number;
}) {
  return (
    <p key={name}>
      {place}. {name} - {weight} lbs{percentage ? ` (${percentage}%)` : ``}
    </p>
  );
}

function calculateLiftData(liftData: LiftArray, weightData: WeightMap) {
  return liftData.map((datum) => {
    const liftWeight = datum.weight;
    const personWeight = weightData[datum.name];
    return { name: datum.name, weight: liftWeight, percentage: Math.round((liftWeight * 100) / personWeight) };
  });
}

function calculateWeightData(weightData: WeightMap) {
  const result: LeaderBoardDatum[] = [];
  Object.keys(weightData).map((name) => {
    result.push({ name: name, weight: weightData[name] });
  });
  return result;
}
