import http from "~/api/core";
import type { Room, RoomInvitation } from "~/types/rooms";

export const getRoomInvitation = async (
  invitationKey: Room["invitation"]["invitationKey"]
): Promise<RoomInvitation> => {
  return http.get(`/rooms/invitation/${invitationKey}`);
};

export const putRoomInvitation = async (
  invitationKey: Room["invitation"]["invitationKey"]
) => {
  // 초대장으로 방에 입장합니다.
  return http.put(`/rooms/invitation/${invitationKey}`);
};
