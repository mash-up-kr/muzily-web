import { atom } from "recoil";
import { NEW_VIDEO_LIST, VIDEO_LIST } from "~/assets/dummy";
import type { Playlist } from "~/types/playlist";

export const playlistAtomState = atom<Playlist>({
  key: "playlist",
  default: NEW_VIDEO_LIST,
});

// 방장만 확인 가능: 신청된 곡 목록
export const proposedPlaylistAtomState = atom<Playlist>({
  key: "proposed-playlist",
  default: [],
});
