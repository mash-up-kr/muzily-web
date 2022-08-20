import type { TimeStamp } from "~/types/core";
import type { Room } from "..";

export type EmojiType = "BOOK" | "HEART" | "MIRROR_BALL";

/*
    CREATOR : 방장
    GUEST : 손님 (빙 입장된 상태)
    PendingGuest (null) : 방 입장하지 않은 손님 
*/
export type PendingGuest = null;
export type Role = "CREATOR" | "GUEST" | PendingGuest;

export interface RoomInvitation extends TimeStamp {
  roomId: Room["roomId"];
  name: string;
  emojiType: EmojiType;
  participantsCount: number; // 접속자수
  currentUser: {
    role: Role;
  };
}
