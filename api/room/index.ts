import http from "~/api/core";
import type { Room } from "~/types/rooms";

export const getRoom = (): Promise<Room> => http.get("/rooms");

export const postRoom = (
  roomReq: Pick<Room, "description" | "moods">
): Promise<Room> =>
  http.post("/rooms", {
    data: roomReq,
  });

export const getRoomDetail = (roomId: Room["roomId"]): Promise<Room> =>
  http.get(`/rooms/${roomId}`);
