import { DATA_REFRESH_MILLIS } from "@/lib/constants";
import { WeightData } from "@/lib/google-sheets";
import { useInterval } from "@/lib/hooks/use-interval";
import { ReactNode, createContext, useState } from "react";

interface Props {
  children: ReactNode;
  initialData: WeightData;
}

export const ChonkContext = createContext<WeightData>({});

export default function ChonkProvider({ children, initialData }: Props) {
  const [data, setData] = useState<WeightData>(initialData);

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
