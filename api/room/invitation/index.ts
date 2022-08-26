import http from "~/api/core";
import type { Invitation, RoomInvitation } from "~/types/rooms";

export const getRoomInvitation = async (
  invitationKey: Invitation["invitationKey"]
): Promise<RoomInvitation> => {
  return http.get(`/rooms/invitation/${invitationKey}`);
};

export const putRoomInvitation = async (
  invitationKey: Invitation["invitationKey"]
) => {
  // 초대장으로 방에 입장합니다.
  return http.put(`/rooms/invitation/${invitationKey}`);
};
