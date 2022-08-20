import { useQueryClient } from "react-query";
import { getPlaylist } from "~/api/playlist";
import { deleteRoom, getRoom, getRooms, postRooms, putRoom } from "~/api/room";
import { queryKeys } from "~/consts/react-query";
import type { Room } from "~/types/rooms";
import { useCoreMutation, useCoreQuery } from "../core";

export const useRoomsQuery = () => useCoreQuery(queryKeys.rooms, getRooms);

export const usePostRoomMutation = () => {
  const queryClient = useQueryClient();

  return useCoreMutation(postRooms, {
    onSuccess: () => queryClient.invalidateQueries(queryKeys.rooms),
  });
};

export const useRoomQuery = (roomId: Room["roomId"]) =>
  useCoreQuery(queryKeys.roomsById(roomId), async () => {
    const room = await getRoom(roomId);
    const playlist = await getPlaylist(room.playlist.playlistId);

    return { ...room, playlist };
  });

export const usePutRoomMutation = (roomId: Room["roomId"]) => {
  const queryClient = useQueryClient();

  return useCoreMutation(putRoom, {
    onSuccess: () => queryClient.invalidateQueries(queryKeys.roomsById(roomId)),
  });
};

export const useDeleteRoomMutation = (roomId: Room["roomId"]) => {
  const queryClient = useQueryClient();

  return useCoreMutation(deleteRoom, {
    onSuccess: () => queryClient.invalidateQueries(queryKeys.roomsById(roomId)),
  });
};

export * from "./invitations";
