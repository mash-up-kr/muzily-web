import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import { getPlaylist } from "~/api/playlist";
import { deleteRoom, getRoom, getRooms, postRooms, putRoom } from "~/api/room";
import { queryKeys } from "~/consts/react-query";
import { playlistAtomState } from "~/store/playlist";
import {
  isHostAtomState,
  playlistIdAtomState,
  roomIdAtomState,
} from "~/store/room";
import type { Room } from "~/types/rooms";
import { useCoreMutation, useCoreQuery } from "../core";

export const useRoomsQuery = () =>
  useCoreQuery(queryKeys.rooms, getRooms, {
    retry: 0,
  });

export const usePostRoomMutation = () => {
  const queryClient = useQueryClient();

  return useCoreMutation(postRooms, {
    onSuccess: () => queryClient.invalidateQueries(queryKeys.rooms),
  });
};

export const useRoomQuery = (
  roomId: Room["roomId"],
  options?: Omit<Parameters<typeof useCoreQuery>[2], "onSuccess" | "onError">
) => {
  const setPlaylist = useSetRecoilState(playlistAtomState);
  const setRoomId = useSetRecoilState(roomIdAtomState);
  const setPlaylistId = useSetRecoilState(playlistIdAtomState);
  const setIsHost = useSetRecoilState(isHostAtomState);

  return useCoreQuery(
    queryKeys.roomsById(roomId),
    async () => {
      const room = await getRoom(roomId);
      const playlist = await getPlaylist(room.playlist.playlistId);

      return { ...room, playlist };
    },
    {
      onSuccess: async (data) => {
        setPlaylist(data.playlist.playlistItems);
        setRoomId(data.roomId);
        setPlaylistId(data.playlist.playlistId);
        setIsHost(data.currentUser.role === "CREATOR");
      },
      retry: 0,
      ...options,
    }
  );
};

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
