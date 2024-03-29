import { atom } from "recoil";
import type { Playlist, PlaylistItem } from "~/types";

export const playlistAtomState = atom<Playlist>({
  key: "playlist",
  default: [],
});

/** 방장만 확인 가능: 신청된 곡 목록 */
export const proposedPlaylistAtomState = atom<Playlist>({
  key: "proposed-playlist",
  default: [],
});

/**  방장만 확인 가능: 삭제할 곡 목록 */
export const removeListAtomState = atom<PlaylistItem["playlistItemId"][]>({
  key: "remove-list",
  default: [],
});
