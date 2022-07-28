import http from "~/api/core";
import type { Member } from "~/types/members";

export const getMember = (): Promise<Member> =>
  http.get({
    url: "/members",
  });
