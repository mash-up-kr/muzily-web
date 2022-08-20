import { atom } from "recoil";
import type { Emoji } from "~/types/emoji";

export const emojiAtomState = atom<Emoji>({
  key: "emoji",
  default: undefined,
});
