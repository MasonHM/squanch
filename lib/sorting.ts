import { LiftData, WeightData } from "./google-sheets";

export function sortByWeight(weightData: WeightData): WeightData {
  return weightData.sort((a, b) => b.weight - a.weight);
}

export function sortByLift(liftData: LiftData): LiftData {
  return liftData.sort((a, b) => b.lift - a.lift);
}
