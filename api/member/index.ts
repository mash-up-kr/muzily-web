import http from "~/api/core";
import type { Member } from "~/types/members";

export const getMember = (): Promise<Member> => http.get("/members");

export const putMember = (
  memberReq: Pick<Member, "nickname" | "profileUrl">
): Promise<Member> =>
  http.put("/members", {
    data: memberReq,
  });
