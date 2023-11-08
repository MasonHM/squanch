import styles from "./tabs.module.scss";
import Leaderboard from "../leaderboard/leaderboard";
import { useContext } from "react";
import { DataContext } from "@/lib/context-providers/data-provider";
import Chart from "../chart/chart";
import { LiftData, WeightMap } from "@/lib/storage/data";

interface WeightTabProps {
  tabName: string;
  active: boolean;
}

interface LiftTabProps {
  tabName: string;
  active: boolean;
}

interface TabProps {
  data: LiftData[] | WeightMap;
  tabName: string;
  active: boolean;
}

export function WeightTabContent({ tabName, active }: WeightTabProps) {
  const dataContext = useContext(DataContext);
  return <TabContent data={dataContext.weightData} tabName={tabName} active={active} />;
}

export function LiftTabContent({ tabName, active }: LiftTabProps) {
  const dataContext = useContext(DataContext);
  return <TabContent data={dataContext.liftData[tabName]} tabName={tabName} active={active} />;
}

function TabContent({ data, tabName, active }: TabProps) {
  return (
    <div className={`${styles.content} ${active ? styles.active : styles.inactive}`}>
      <Leaderboard data={data} title={tabName} key={tabName} />
      <Chart liftName={tabName} />
    </div>
  );
}
