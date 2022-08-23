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

/**
 * duration을 초 형태로 변경
 * ex) PT3M19S -> 199
 */
export const convertDurationToSecond = (duration: string) => {
  const [rawMinute, rawSecond] = duration.slice(2, -1).split("M");
  const totalSecond = (() => {
    const minute = Number.isNaN(Number(rawMinute)) ? 0 : Number(rawMinute);
    const second = Number.isNaN(Number(rawSecond)) ? 0 : Number(rawSecond);

    return minute * 60 + second;
  })();

  return totalSecond;
};
