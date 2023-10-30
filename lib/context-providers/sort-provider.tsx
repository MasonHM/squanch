import { LeaderBoardDatum } from "@/components/leaderboard/leaderboard-data";
import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
}

export enum LeaderboardSortMethod {
  weight,
  percent,
}

export type LeaderboardSortContextData = {
  sortMethod: LeaderboardSortMethod;
  setSortMethod: Dispatch<SetStateAction<LeaderboardSortMethod>>;
};

export const LeaderboardSortContext = createContext<LeaderboardSortContextData>({
  sortMethod: LeaderboardSortMethod.weight,
  setSortMethod: () => {},
});

export default function LeaderboardSortProvider({ children }: Props) {
  const [sortMethod, setSortMethod] = useState<LeaderboardSortMethod>(LeaderboardSortMethod.weight);

  return (
    <LeaderboardSortContext.Provider value={{ sortMethod: sortMethod, setSortMethod: setSortMethod }}>
      {children}
    </LeaderboardSortContext.Provider>
  );
}

const SORT_BY_WEIGHT = (a: LeaderBoardDatum, b: LeaderBoardDatum) => b.weight - a.weight;
const SORT_BY_PERCENT = (a: LeaderBoardDatum, b: LeaderBoardDatum) => (b.percentage || 0) - (a.percentage || 0);

export function getSortFunc(sortMethod: LeaderboardSortMethod) {
  let sortFunc;
  switch (sortMethod) {
    case LeaderboardSortMethod.percent:
      sortFunc = SORT_BY_PERCENT;
      break;
    case LeaderboardSortMethod.weight:
      sortFunc = SORT_BY_WEIGHT;
      break;
    default:
      sortFunc = SORT_BY_WEIGHT;
  }
  return sortFunc;
}
