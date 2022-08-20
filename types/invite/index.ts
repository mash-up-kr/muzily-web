export interface InvitationInfo {
  roomId: number;
  name: string;
  emojiType: "BOOK" | "HEART" | "MIRROR_BALL";
  participantsCount: number; // 접속자수
  currentUser: {
    role: "CREATOR" | "GUEST" | null;
  };
  createdAt: string;
  updatedAt: string;
}
