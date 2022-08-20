import { useQueryClient } from "react-query";
import { getRoomInvitation, putRoomInvitation } from "~/api/room/invitation";
import { queryKeys } from "~/consts/react-query";
import { useCoreMutation, useCoreQuery } from "~/hooks/api/core";
import type { Room } from "~/types/rooms";

export const useRoomInvitationQuery = (
  invitationKey: Room["invitation"]["invitationKey"]
) =>
  useCoreQuery(queryKeys.roomInvitationByKey(invitationKey), async () =>
    getRoomInvitation(invitationKey)
  );

export const usePutRoomInvitationMutation = (
  invitationKey: Room["invitation"]["invitationKey"]
) => {
  const queryClient = useQueryClient();

  return useCoreMutation(putRoomInvitation, {
    onSuccess: () =>
      queryClient.invalidateQueries(
        queryKeys.roomInvitationByKey(invitationKey)
      ),
  });
};
