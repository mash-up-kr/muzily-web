import { VIDEO_LIST } from "~/assets/dummy";
import type { Music } from "~/types/musics";

export const getPlaylist = (): Promise<Music[]> => {
  return new Promise((resolve, reject) => {
    resolve(VIDEO_LIST);
  });
};
