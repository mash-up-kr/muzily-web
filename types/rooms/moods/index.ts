import type { EmojiType } from "~/types/emojis";

export interface Mood {
  name: string;
  emojiType: EmojiType;
}

export interface MoodWithImageName extends Mood {
  emojiTypeImageName: string;
}
