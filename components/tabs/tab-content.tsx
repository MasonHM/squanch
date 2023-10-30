import { LiftArray, WeightMap } from "@/lib/google-sheets";
import styles from "./tabs.module.scss";
import Leaderboard from "../leaderboard/leaderboard";
import { useEffect, useState } from "react";
import { useInterval } from "@/lib/hooks/use-interval";
import { DATA_REFRESH_MILLIS } from "@/lib/constants";

interface WeightTabProps {
  data: WeightMap;
  tabName: string;
  active: boolean;
}

interface LiftTabProps {
  initialData: LiftArray;
  tabName: string;
  active: boolean;
}

interface TabProps {
  data: LiftArray | WeightMap;
  tabName: string;
  active: boolean;
}

export function WeightTabContent({ data, tabName, active }: WeightTabProps) {
  return <TabContent data={data} tabName={tabName} active={active} />;
}

export function LiftTabContent({ initialData, tabName, active }: LiftTabProps) {
  const [data, setData] = useState<LiftArray>(initialData);

  const fetchTabData = async () => {
    const res = await fetch(`/api/${tabName}`);
    const newData = await res.json();
    if (JSON.stringify(newData) !== JSON.stringify(data)) {
      setData(newData);
    }
  };

  useEffect(() => {
    fetchTabData();
  }, []);
  useInterval(fetchTabData, DATA_REFRESH_MILLIS);

  return <TabContent data={data} tabName={tabName} active={active} />;
}

function TabContent({ data, tabName, active }: TabProps) {
  return (
    <div className={active ? styles.active : styles.inactive}>
      <Leaderboard data={data} title={tabName} key={tabName} />
    </div>
  );
}
