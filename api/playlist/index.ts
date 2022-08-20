import http from "~/api/core";
import type { PlaylistItem, PlaylistReponse } from "~/types";

export const getPlaylist = (playlistId: number): Promise<PlaylistReponse> => {
  return http.get(`/playlists/${playlistId}`);
};

export const getPlaylistPendingItems = (
  playlistId: number
): Promise<PlaylistItem[]> =>
  http.get(`/playlists/${playlistId}/pending-items`);
