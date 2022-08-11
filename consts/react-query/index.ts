// NOTE: react-query useQuery() 사용할 때 쓰는 queryKey
// parameter를 받는 경우 함수 형태로 작성 (roomsById 참고)
export const queryKeys = {
  member: ["member"],
  rooms: ["rooms"],
  playlist: ["playlist"],
  roomsById: (roomId: number) => ["rooms", roomId],
} as const;
