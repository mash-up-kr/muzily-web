import { atom } from "recoil";
import type { Playlist } from "~/types/playlist";

export const userQueueAtomState = atom<Playlist[]>({
  key: "userQueue",
  default: undefined,
});
