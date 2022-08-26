import type { TimeStamp } from "../core";
import type { Role } from "./invitations";
import type { Mood } from "./moods";

export interface CurrentUser {
  role: Role;
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
  mood: Mood;
  currentUser: CurrentUser;
  participantsCount: number;
  invitation: Invitation;
  playlist: PlayList;
}

export * from "./invitations";
export * from "./moods";
