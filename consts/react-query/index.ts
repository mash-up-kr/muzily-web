// NOTE: react-query useQuery() 사용할 때 쓰는 queryKey

import type { Room } from "~/types/rooms";

// parameter를 받는 경우 함수 형태로 작성 (roomsById 참고)
export const queryKeys = {
  auth: ["auth"],
  member: ["member"],
  moodSuggestion: (roomId: Room["roomId"]) => ["moodSuggestion", roomId],
  playlist: (playlistId: Room["playlist"]["playlistId"]) => [
    "playlist",
    playlistId,
  ],
  pendingPlaylist: (playlistId: Room["playlist"]["playlistId"]) => [
    "pendingPlaylist",
    playlistId,
  ],
  rooms: ["rooms"],
  roomsById: (roomId: Room["roomId"]) => ["rooms", roomId],
  roomInvitationByKey: (invitationKey: Room["invitation"]["invitationKey"]) => [
    "roomInvitation",
    invitationKey,
  ],
} as const;
