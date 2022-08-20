import http from "~/api/core";
import type { InvitationInfo } from "~/types/invite";

export const getInvitationInfo = async (
  invitationKey: string
): Promise<InvitationInfo> => {
  return http.get(`/rooms/invitation/${invitationKey}`);
};

export const requestJoinToRoom = async (invitationKey: string) => {
  return http.put(`/rooms/invitation/${invitationKey}`);
};
