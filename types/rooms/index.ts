import type { TimeStamp } from "../core";

export interface CurrentUser {
  role: string;
}

export interface Invitation {
  invitationKey: string;
}

export interface PlayList {
  playlistId: number;
}

export interface Room extends TimeStamp {
  roomId: number;

  name: string;
  emojiType: string;

  currentUser: CurrentUser;
  participantsCount: number;

  invitation: Invitation;

  playlist: PlayList;
}

export * from "./invitations";
export * from "./moods";
