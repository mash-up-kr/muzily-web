import { useQuery } from "react-query";
import { getInvitationInfo } from "~/api/invite";

export const useInvitation = (invitationKey: string) => {
  return useQuery(
    ["invite"],
    async () => {
      const invite = await getInvitationInfo(invitationKey);

      return invite;
    },
    {
      onSuccess: () => {
        console.log("success");
      },
    }
  );
};
