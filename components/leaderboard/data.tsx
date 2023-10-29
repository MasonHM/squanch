import { ChonkContext } from "@/lib/context-providers/chonk-provider";
import { SortContext, SortContextData, SortMethod } from "@/lib/context-providers/sort-provider";
import { WeightData } from "@/lib/google-sheets";
import { useContext } from "react";
import styles from "./leaderboard.module.scss";

type DataWithPercentBodyWeight = {
  [name: string]: {
    weight: number;
    percentage: number;
  };
};

export default function LeaderboardData({ data }: { data: WeightData; sort?: string }) {
  const weightData: WeightData = useContext(ChonkContext);
  const calculatedData: DataWithPercentBodyWeight = calculateData(data, weightData);

  const sortContext: SortContextData = useContext(SortContext);
  const sortByWeightFunc = (a: string, b: string) => calculatedData[b].weight - calculatedData[a].weight;
  const sortByPercentageFunc = (a: string, b: string) => calculatedData[b].percentage - calculatedData[a].percentage;
  let sortFunc = sortByWeightFunc;
  switch (sortContext.sortMethod) {
    case SortMethod.percent:
      sortFunc = sortByPercentageFunc;
      break;
    case SortMethod.weight:
      sortFunc = sortByWeightFunc;
      break;
    default:
      sortFunc = sortByWeightFunc;
  }

  return (
    <div className={styles.data}>
      {Object.keys(calculatedData)
        .sort(sortFunc)
        .map((name, index) => {
          const calculatedDatum = calculatedData[name];
          return (
            <p key={name}>
              {index + 1}. {name} - {calculatedDatum.weight} lbs ({calculatedDatum.percentage}%)
            </p>
          );
        })}
    </div>
  );
}

function calculateData(liftData: WeightData, weightData: WeightData) {
  return Object.keys(liftData).reduce<DataWithPercentBodyWeight>((result, name) => {
    const liftWeight = liftData[name];
    const personWeight = weightData[name];
    result[name] = { weight: liftWeight, percentage: Math.ceil((liftWeight * 100) / personWeight) };
    return result;
  }, {});
}
