import http from "~/api/core";
import type { Member, PutMemberReq } from "~/types/members";

export const getMember = (): Promise<Member> =>
  http.get({
    url: "/members",
  });

export const putMember = (memberReq: PutMemberReq): Promise<Member> =>
  http.put({
    url: "/members",
    data: memberReq,
  });
