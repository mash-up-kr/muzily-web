import type { TimeStamp } from "~/types/core";
import type { Mood, Room } from "..";

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
  mood: Mood;
  participantsCount: number; // 접속자수
  playListItemsCount: number;
  currentUser: {
    role: Role;
  };
}
