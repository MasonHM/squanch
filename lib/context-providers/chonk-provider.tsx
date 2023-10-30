import { DATA_REFRESH_MILLIS } from "@/lib/constants";
import { WeightMap } from "@/lib/google-sheets";
import { useInterval } from "@/lib/hooks/use-interval";
import { ReactNode, createContext, useState } from "react";

interface Props {
  children: ReactNode;
  initialData: WeightMap;
}

export const ChonkContext = createContext<WeightMap>({});

export default function ChonkProvider({ children, initialData }: Props) {
  const [data, setData] = useState<WeightMap>(initialData);

  const fetchWeightData = async () => {
    const res = await fetch(`/api/chonk`);
    const newData = await res.json();
    if (JSON.stringify(newData) !== JSON.stringify(data)) {
      setData(newData);
    }
  };
  useInterval(fetchWeightData, DATA_REFRESH_MILLIS);

  return <ChonkContext.Provider value={data}>{children}</ChonkContext.Provider>;
}
