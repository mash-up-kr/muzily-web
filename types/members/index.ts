export interface Member {
  accountConnectType: "CONNECTED" | "UNCONNECTED";
  nickname: string;
  profileUrl: string;
}

export interface PutMemberReq {
  nickname: string;
  profileUrl: string;
}
