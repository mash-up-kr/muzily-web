import { atom } from "recoil";
import type { Emoji } from "~/types";

export const emojiAtomState = atom<Emoji | undefined>({
  key: "emoji",
  default: undefined,
});
