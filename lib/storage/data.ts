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
};

export const DEFAULT_DATA: CombinedData = {
  liftData: {
    squanch: [],
    bunch: [],
    dunch: [],
  },
  weightData: {},
};

export type Update = {
  title: string;
  body: string;
};
export function findDifferencesBetweenCombinedData(oldData: CombinedData, newData: CombinedData): Update[] {
  let differences: Update[] = [];
  const lifts = Object.keys(oldData.liftData);
  for (let i = 0; i < lifts.length; i++) {
    const lift = lifts[i];
    differences.push(...findDifferencesBetweenLiftData(oldData.liftData[lift], newData.liftData[lift], lift));
  }
  differences.push(...findDifferenceBetweenWeightMap(oldData.weightData, newData.weightData));

  return differences;
}

function findDifferencesBetweenLiftData(oldData: LiftData[], newData: LiftData[], liftName: string): Update[] {
  let differences: Update[] = [];
  const curr1RMMap: { [name: string]: number } = {};
  for (let i = 0; i < oldData.length; i++) {
    const oldDatum: LiftData = oldData[i];
    curr1RMMap[oldDatum.name] = oldDatum.curr1RM;
  }

  for (let i = 0; i < newData.length; i++) {
    const newDatum: LiftData = newData[i];
    const old1RM = curr1RMMap[newDatum.name];
    const new1RM = newDatum.curr1RM;
    if (new1RM != old1RM) {
      differences.push({
        title: `BREAKING NEWS - ${liftName.toUpperCase()}`,
        body: `${newDatum.name} set a new ${liftName} 1RM of ${new1RM}!`,
      });
    }
  }
  return differences;
}

function findDifferenceBetweenWeightMap(oldData: WeightMap, newData: WeightMap): Update[] {
  let differences: Update[] = [];
  const oldDataKeys = Object.keys(oldData);
  const newDataKeys = Object.keys(newData);
  if (oldDataKeys.length != newDataKeys.length) {
    differences.push({ title: "Who?", body: "A new challenger appeared..." });
  }
  for (let i = 0; i < oldDataKeys.length; i++) {
    const person = oldDataKeys[i];
    const oldWeight = oldData[person];
    const newWeight = newData[person];
    if (oldWeight != newWeight) {
      const weightDifference = Math.round(((newWeight - oldWeight) * 100) / 100);
      const title = weightDifference > 0 ? "Fat Fuck Alert" : "Skinny Bitch Alert";
      differences.push({
        title: title,
        body: `${person} now weighs ${newWeight} lb (${weightDifference > 0 ? `+` : ``}${weightDifference} lb)`,
      });
    }
  }

  return differences;
}
