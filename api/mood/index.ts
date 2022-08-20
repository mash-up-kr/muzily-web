import http from "~/api/core";
import type { Pagination, PaginationQueryParam } from "~/types/core/pagination";
import type { Room } from "~/types/rooms";
import type { MoodSuggestion } from "~/types/rooms/moods/suggestions";

export const getMoodSuggestions = (
  roomId: Room["roomId"],
  paginationReq: PaginationQueryParam
): Promise<Pagination<MoodSuggestion>> =>
  http.get(`/room/${roomId}/mood/suggestions`, {
    params: paginationReq,
  });

export const postMoodSuggestions = ({
  roomId,
  moodSuggestionReq,
}: {
  roomId: Room["roomId"];
  moodSuggestionReq: {
    names: MoodSuggestion["name"][];
  };
}): Promise<void> =>
  http.post(`/room/${roomId}/mood/suggestions`, {
    data: moodSuggestionReq,
  });

export const deleteMoodSuggestions = ({
  roomId,
  suggestionId,
}: {
  roomId: number;
  suggestionId: MoodSuggestion["suggestionId"];
}): Promise<void> =>
  http.delete(`/room/${roomId}/mood/suggestions/${suggestionId}`);
