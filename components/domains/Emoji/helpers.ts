import { STAGE } from "./constants";

export const getStage = (percentage: number) =>
  percentage > 0 && percentage < STAGE._1_MAX_PERCENTAGE
    ? 1
    : percentage >= STAGE._1_MAX_PERCENTAGE &&
      percentage < STAGE._2_MAX_PERCENTAGE
    ? 2
    : 3;
