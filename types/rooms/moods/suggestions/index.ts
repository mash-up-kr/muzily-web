import type { TimeStamp } from "~/types/core";

export interface MoodSuggestion extends TimeStamp {
  name: string;
  suggestionId: number;
}
