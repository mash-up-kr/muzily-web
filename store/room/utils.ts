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
