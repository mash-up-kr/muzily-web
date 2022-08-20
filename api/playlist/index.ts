import http from "~/api/core";
import { VIDEO_LIST } from "~/assets/dummy";
import type { Music } from "~/types/musics";

export const getPlaylist = (playlistId: number): Promise<Music[]> => {
  return http.get(`/playlists/${playlistId}`);
};
