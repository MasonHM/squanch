import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";

interface Props {
  children: ReactNode;
}

export enum SortMethod {
  weight,
  percent,
}

export type SortContextData = {
  sortMethod: SortMethod;
  setSortMethod: Dispatch<SetStateAction<SortMethod>>;
};

export const SortContext = createContext<SortContextData>({ sortMethod: SortMethod.weight, setSortMethod: () => {} });

export default function SortProvider({ children }: Props) {
  const [sortMethod, setSortMethod] = useState<SortMethod>(SortMethod.weight);

  return (
    <SortContext.Provider value={{ sortMethod: sortMethod, setSortMethod: setSortMethod }}>
      {children}
    </SortContext.Provider>
  );
}
