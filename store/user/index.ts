import { atom } from "recoil";
import type { Playlist } from "~/types";

export const userQueueAtomState = atom<Playlist>({
  key: "userQueue",
  default: undefined,
});
