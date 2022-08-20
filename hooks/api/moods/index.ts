import { useQueryClient } from "react-query";
import {
  deleteMoodSuggestions,
  getMoodSuggestions,
  postMoodSuggestions,
} from "~/api/mood";
import { queryKeys } from "~/consts/react-query";
import type { PaginationQueryParam } from "~/types/core";
import type { Room } from "~/types/rooms";
import { useCoreMutation, useCoreQuery } from "../core";

export const useMoodSuggestionsQuery = (
  roomId: Room["roomId"],
  paginationReq: PaginationQueryParam
) =>
  useCoreQuery(queryKeys.moodSuggestion(roomId), async () =>
    getMoodSuggestions(roomId, paginationReq)
  );

export const usePostMoodSuggestionsMutation = (roomId: Room["roomId"]) => {
  const queryClient = useQueryClient();

  return useCoreMutation(postMoodSuggestions, {
    onSuccess: () =>
      queryClient.invalidateQueries(queryKeys.moodSuggestion(roomId)),
  });
};

export const useDeleteMoodSuggestionsMutation = (roomId: Room["roomId"]) => {
  const queryClient = useQueryClient();

  return useCoreMutation(deleteMoodSuggestions, {
    onSuccess: () =>
      queryClient.invalidateQueries(queryKeys.moodSuggestion(roomId)),
  });
};
