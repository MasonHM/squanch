export function getLiftAsPercentageOfBodyWeight(liftWeight: number, bodyWeight: number) {
  return Math.round((liftWeight * 100) / bodyWeight);
}
