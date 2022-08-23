import { getPlaylist, getPlaylistPendingItems } from "~/api/playlist";
import { queryKeys } from "~/consts/react-query";
import { useCoreQuery } from "~/hooks/api/core";
import type { Room } from "~/types/rooms";

export const useGetPlaylists = (playlistId: Room["playlist"]["playlistId"]) =>
  useCoreQuery(queryKeys.playlist(playlistId), async () =>
    getPlaylist(playlistId)
  );

export const useGetPlaylistPendingItems = (
  playlistId: Room["playlist"]["playlistId"]
) =>
  useCoreQuery(queryKeys.pendingPlaylist(playlistId), async () =>
    getPlaylistPendingItems(playlistId)
  );
