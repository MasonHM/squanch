export type LiftData = {
  name: string;
  curr1RM: number;
  raw: { [index: number]: number };
};

export type WeightMap = {
  [name: string]: number;
};

export type CombinedData = {
  liftData: {
    [name: string]: LiftData[];
    squanch: LiftData[];
    bunch: LiftData[];
    dunch: LiftData[];
  };
  weightData: WeightMap;
  graphLabels: string[];
};
