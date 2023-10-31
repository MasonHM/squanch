import { COLORS } from "../constants";

export function getShuffledColors() {
  return COLORS.map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
