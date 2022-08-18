import { atom } from "recoil";
import type { Playlist } from "~/types/playlist";
import type { Room } from "~/types/rooms";

export const roomAtomState = atom<Room>({
  key: "socket-room", // 현재 이미 사용 중인 room이 있어 중복 방지를 위해 키값 적용
  default: undefined,
});

export const playlistAtomState = atom<Playlist[]>({
  key: "playlist",
  default: [],
});
