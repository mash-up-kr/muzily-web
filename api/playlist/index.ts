import http from "~/api/core";
import type { Music } from "~/types/musics";

export const getPlaylist = (playlistId: number): Promise<Music[]> => {
  return http.get(`/playlists/${playlistId}`);
};
