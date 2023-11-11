"use client";
import React, { useContext } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  TimeScale,
  ArcElement,
  Tick,
  TooltipItem,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import styles from "./chart.module.scss";
import { getShuffledColors } from "@/lib/colors/color-helper";
import { DataContext } from "@/lib/context-providers/data-provider";
import {
  LeaderboardSortContext,
  LeaderboardSortContextData,
  LeaderboardSortMethod,
} from "@/lib/context-providers/sort-provider";
import { getLiftAsPercentageOfBodyWeight } from "@/lib/weight/weight-helper";
import { CombinedData, LiftData, WeightMap } from "@/lib/storage/data";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, ArcElement);

type Props = {
  liftName: string;
};
export default function Chart({ liftName }: Props) {
  const data: CombinedData = useContext(DataContext);
  const sortData: LeaderboardSortContextData = useContext(LeaderboardSortContext);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.chart}>
          {data ? (
            liftName == "chonk" ? (
              <Pie options={createPieOptions(liftName)} data={convertDataToPieChartData(data, liftName)} />
            ) : (
              <Line
                options={createLineOptions(liftName, sortData.sortMethod)}
                data={convertDataToLineChartData(data, liftName, sortData.sortMethod)}
              />
            )
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
}

const addUnitToTooltipLabel = (label: string) => {
  return (item: TooltipItem<any>) => {
    return `${item.dataset.label ? item.dataset.label + ": " : ""}${item.formattedValue}${label}`;
  };
};
const addUnitToTick = (label: string) => {
  return (value: number, index: number, ticks: Tick[]) => {
    return `${value}${label}`;
  };
};
function createLineOptions(title: string, sortMethod: LeaderboardSortMethod) {
  let tickCallback = addUnitToTick(" lb");
  let tooltipCallback = addUnitToTooltipLabel(" lb");
  if (sortMethod == LeaderboardSortMethod.percent) {
    tickCallback = addUnitToTick("%");
    tooltipCallback = addUnitToTooltipLabel("%");
  }
  const scaleSection = {
    x: {
      ticks: {
        autoSkip: true,
        maxTicksLimit: 20,
      },
    },
    y: {
      ticks: {
        callback: tickCallback,
      },
    },
  };
  return createOptions(title, scaleSection, tooltipCallback);
}

function createPieOptions(title: string) {
  return createOptions(title, {}, addUnitToTooltipLabel(" lb"));
}

function createOptions(title: string, scaleSection: any, tooltipLabelCallback: (item: TooltipItem<any>) => string) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    showLine: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: title.toUpperCase(),
      },
      tooltip: {
        callbacks: {
          label: tooltipLabelCallback,
        },
      },
    },
    scales: scaleSection,
  };
}

function convertDataToLineChartData(
  combinedData: CombinedData,
  liftName: string,
  sortMethod: LeaderboardSortMethod
): ChartData<"line", number[], string> {
  const shuffledColors = getShuffledColors();
  const currentLiftArray: LiftData[] = combinedData.liftData[liftName];

  const labels: string[] = createChartLabels();

  return {
    labels,
    datasets: currentLiftArray.map((datum: LiftData, index: number) => {
      let chartData;
      if (sortMethod == LeaderboardSortMethod.weight) {
        chartData = convertRawLiftDataToChartData(datum.raw, labels.length);
      } else {
        chartData = convertRawLiftDataToPercentageChartData(
          datum.raw,
          combinedData.weightData[datum.name],
          labels.length
        );
      }

      return {
        label: datum.name,
        data: chartData,
        borderColor: "black",
        backgroundColor: shuffledColors[index],
        yAxisID: "y",
        pointRadius: 5,
      };
    }),
  };
}

function createChartLabels() {
  const now = new Date();
  const currMonth = now.getMonth() + 1;
  const currDay = now.getDate();
  const dateRange = getDateRangeForGraph();
  return dateRange.filter((monthDayString) => {
    const [labelMonth, labelDay] = monthDayString.split("/");
    if (currMonth < Number(labelMonth) || (currMonth == Number(labelMonth) && currDay < Number(labelDay))) {
      return false;
    }
    return true;
  });
}

const SQUANCH_BEGIN = new Date("2023-09-28T00:00:00");
function getDateRangeForGraph(): string[] {
  const now = new Date();
  const milliSinceBegin = now.getTime() - SQUANCH_BEGIN.getTime();
  const daysSinceBegin = Math.abs(Math.ceil(milliSinceBegin / (1000 * 60 * 60 * 24)));
  return [...Array(daysSinceBegin).keys()].map((dayCount): string => {
    const currDate = new Date(SQUANCH_BEGIN);
    currDate.setDate(currDate.getDate() + dayCount);
    const month = currDate.getMonth() + 1;
    const day = currDate.getDate();
    return `${month}/${day}`;
  });
}

function convertDataToPieChartData(combinedData: CombinedData, lift: string): ChartData<"pie", number[], string> {
  const shuffledColors = getShuffledColors();

  const weightData: WeightMap = combinedData.weightData;
  const labels: string[] = Object.keys(combinedData.weightData);
  return {
    labels,
    datasets: [
      {
        data: labels.map((name) => combinedData.weightData[name]),
        borderColor: "black",
        backgroundColor: shuffledColors.map((color) => color),
      },
    ],
  };
}

function convertRawLiftDataToChartData(
  rawData: {
    [index: number]: number;
  },
  numLabels: number
): number[] {
  const result: number[] = [];
  for (let i = 0; i < numLabels; i++) {
    if (rawData[i]) {
      result.push(rawData[i]);
    } else {
      result.push(NaN);
    }
  }
  return result;
}

function convertRawLiftDataToPercentageChartData(
  rawData: {
    [index: number]: number;
  },
  bodyWeight: number,
  numLabels: number
): number[] {
  const result: number[] = [];
  for (let i = 0; i < numLabels; i++) {
    const liftWeight = rawData[i];
    if (liftWeight) {
      result.push(getLiftAsPercentageOfBodyWeight(liftWeight, bodyWeight));
    } else {
      result.push(NaN);
    }
  }
  return result;
}
