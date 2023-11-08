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

export function findDifferencesBetweenCombinedData(oldData: CombinedData, newData: CombinedData): string[] {
  let differences: string[] = [];
  const lifts = Object.keys(oldData.liftData);
  for (let i = 0; i < lifts.length; i++) {
    const lift = lifts[i];
    differences.push(...findDifferencesBetweenLiftData(oldData.liftData[lift], newData.liftData[lift], lift));
  }
  differences.push(...findDifferenceBetweenWeightMap(oldData.weightData, newData.weightData));

  return differences;
}

function findDifferencesBetweenLiftData(oldData: LiftData[], newData: LiftData[], liftName: string): string[] {
  let differences: string[] = [];
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
      differences.push(`${getTimestamp()} - ${newDatum.name} set a new ${liftName} 1RM of ${new1RM}!`);
    }
  }
  return differences;
}

function findDifferenceBetweenWeightMap(oldData: WeightMap, newData: WeightMap): string[] {
  let differences: string[] = [];
  const oldDataKeys = Object.keys(oldData);
  const newDataKeys = Object.keys(newData);
  if (oldDataKeys.length != newDataKeys.length) {
    differences.push(`${getTimestamp()} - A new challenger appeared...`);
  }
  for (let i = 0; i < oldDataKeys.length; i++) {
    const person = oldDataKeys[i];
    const oldWeight = oldData[person];
    const newWeight = newData[person];
    if (oldWeight != newWeight) {
      const weightDifference = Math.round(((newWeight - oldWeight) * 100) / 100);
      differences.push(
        `${getTimestamp()} - ${person} now weighs ${newWeight} lb (${
          weightDifference > 0 ? `+` : ``
        }${weightDifference} lb)`
      );
    }
  }

  return differences;
}

function getTimestamp() {
  return new Date().toLocaleString("en-us", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    minute: "numeric",
    hour: "numeric",
  });
}
