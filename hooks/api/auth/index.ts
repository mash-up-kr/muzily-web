import { useQueryClient } from "react-query";
import { postAuth, postAuthAnonymous, postLogout } from "~/api/auth";
import { queryKeys } from "~/consts/react-query";
import { useCoreMutation } from "~/hooks/api/core";

export const usePostAuthMutation = () => {
  const queryClient = useQueryClient();

  return useCoreMutation(postAuth, {
    onSuccess: () => queryClient.invalidateQueries(queryKeys.auth),
  });
};

export const usePostAuthAnonymousMutation = () => {
  const queryClient = useQueryClient();

  return useCoreMutation(postAuthAnonymous, {
    onSuccess: () => queryClient.invalidateQueries(queryKeys.auth),
  });
};

export const usePostLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useCoreMutation(postLogout, {
    onSuccess: () => queryClient.invalidateQueries(queryKeys.auth),
  });
};
