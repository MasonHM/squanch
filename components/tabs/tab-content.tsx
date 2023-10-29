import { WeightData } from "@/lib/google-sheets";
import styles from "./tabs.module.scss";
import Leaderboard from "../leaderboard/leaderboard";
import { useEffect, useState } from "react";
import { useInterval } from "@/lib/hooks/use-interval";
import { DATA_REFRESH_MILLIS } from "@/lib/constants";

interface TabProps {
  initialData: WeightData;
  tabName: string;
  active: boolean;
}

export function TabContent({ initialData, tabName, active }: TabProps) {
  const [data, setData] = useState<WeightData>(initialData);

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

  return (
    <div className={active ? styles.active : styles.inactive}>
      <Leaderboard data={data} title={tabName} key={tabName} />
    </div>
  );
}
