import http from "~/api/core";
import type { Playlist, PlaylistItem } from "~/types/playlist";

export const getPlaylist = (playlistId: number): Promise<Playlist> => {
  return http.get(`/playlists/${playlistId}`);
};

export const getPlaylistPendingItems = (
  playlistId: number
): Promise<PlaylistItem[]> =>
  http.get(`/playlists/${playlistId}/pending-items`);
