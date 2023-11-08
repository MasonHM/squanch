import { DATA_REFRESH_MILLIS } from "@/lib/constants";
import { useInterval } from "@/lib/hooks/use-interval";
import { ReactNode, createContext, useState } from "react";
import styles from "@/app/page.module.scss";
import { CombinedData } from "../storage/data";

interface Props {
  children: ReactNode;
}

const DEFAULT_DATA: CombinedData = {
  liftData: {
    squanch: [],
    bunch: [],
    dunch: [],
  },
  weightData: {},
  graphLabels: [],
};

export const DataContext = createContext<CombinedData>(DEFAULT_DATA);

export default function DataProvider({ children }: Props) {
  const [data, setData] = useState<CombinedData>(DEFAULT_DATA);

  const fetchData = async () => {
    const res = await fetch(`/api/combined`);
    const newData = await res.json();
    if (JSON.stringify(newData) !== JSON.stringify(data)) {
      setData(newData);
    }
  };
  useInterval(fetchData, DATA_REFRESH_MILLIS);

  return (
    <DataContext.Provider value={data}>
      {data == DEFAULT_DATA ? (
        <div className={styles.loading}>
          <h1>SQUANCH...</h1>
        </div>
      ) : (
        children
      )}
    </DataContext.Provider>
  );
}
