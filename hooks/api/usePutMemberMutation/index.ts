import { useQueryClient } from "react-query";
import { putMember } from "~/api";
import { queryKeys } from "~/consts/react-query";
import { useCoreMutation } from "~/hooks/api/core";

const usePutMemberMutation = () => {
  const queryClient = useQueryClient();

  return useCoreMutation(putMember, {
    onSuccess: () => queryClient.invalidateQueries(queryKeys.member),
  });
};

export default usePutMemberMutation;
