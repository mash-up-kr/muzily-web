export type EmojiType = "HEART" | "MIRROR_BALL" | "BOOK";

export interface Emoji {
  emojiType: EmojiType;
  intensity: number;
  senderId: number;
  messageText: string;
}
