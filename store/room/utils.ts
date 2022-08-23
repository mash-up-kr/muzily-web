import type { Playlist } from "~/types";

/** 
 * 재생 시간 계산
 - ex) 206 -> 03:26
 */
export function getDurationText(duration: number) {
  if (!duration) {
    return "-";
  }

  const min = Math.floor(duration / 60);
  const sec = duration - min * 60;

  return `${min > 9 ? min : `0${min}`}:${sec > 9 ? sec : `0${sec}`}`;
}

export const getMusicIndex = (id: number, playlist: Playlist) => {
  const index = playlist.findIndex((item) => item.id === id);

  return index === -1 ? 0 : index;
};
