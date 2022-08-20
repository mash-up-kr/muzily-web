import http from "~/api/core";
import type { Mood, Room } from "~/types/rooms";

export const getRooms = (): Promise<Room> => http.get("/rooms");

export const postRooms = (roomReq: Mood): Promise<Room> =>
  http.post("/rooms", {
    data: roomReq,
  });

export const getRoom = (roomId: Room["roomId"]): Promise<Room> =>
  http.get(`/rooms/${roomId}`);

export const putRoom = ({
  roomId,
  moodReq,
}: {
  roomId: Room["roomId"];
  moodReq: Mood;
}): Promise<Room> =>
  http.put(`/rooms/${roomId}`, {
    data: moodReq,
  });

export const deleteRoom = (roomId: Room["roomId"]): Promise<void> =>
  http.delete(`/rooms/${roomId}`);
