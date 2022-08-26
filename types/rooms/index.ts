import type { TimeStamp } from "../core";
import type { EmojiType } from "../emojis";
import type { Role } from "./invitations";

export interface CurrentUser {
  role: Role;
}

export interface Invitation {
  invitationKey: string;
}

export interface PlayList {
  playlistId: number;
}

export interface Mood {
  emojiType: EmojiType;
  moodDescription: string;
}

export interface Room extends TimeStamp {
  roomId: number;
  name: string;
  mood: Mood;
  currentUser: CurrentUser;
  participantsCount: number;
  invitation: Invitation;
  playlist: PlayList;
}

export * from "./invitations";
export * from "./moods";
