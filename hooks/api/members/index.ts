import { useQueryClient } from "react-query";
import { getMember, putMember } from "~/api";
import { queryKeys } from "~/consts/react-query";
import { useCoreQuery, useCoreMutation } from "~/hooks/api/core";

export const useMemberQuery = () => useCoreQuery(queryKeys.member, getMember);

export const usePutMemberMutation = () => {
  const queryClient = useQueryClient();

  return useCoreMutation(putMember, {
    onSuccess: () => queryClient.invalidateQueries(queryKeys.member),
  });
};
