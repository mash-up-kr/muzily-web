export interface Mood {
  name: string;
  emoji: string;
}

export interface Room {
  roomId: number;
  description: string;
  role: "CREATOR";
  playlistId: number;
  participantsCount: number;
  moods: Mood[];
  invitationKey: string;
  createdAt: string;
  updatedAt: string;
}
