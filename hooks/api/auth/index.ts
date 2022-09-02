import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { postAuth, postAuthAnonymous, postLogout } from "~/api/auth";
import { Toast } from "~/components/uis";
import { queryKeys } from "~/consts/react-query";
import { useCoreMutation } from "~/hooks/api/core";

const tokenKey = process.env.NEXT_PUBLIC_LOCAL_TOKEN_KEY as string;

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
  const router = useRouter();
  const queryClient = useQueryClient();

  return useCoreMutation(postLogout, {
    onSuccess: () => {
      Toast.show("로그아웃에 성공하였습니다.", {
        duration: 3000,
      });

      localStorage.removeItem(tokenKey);
      queryClient.invalidateQueries(queryKeys.auth);

      router.replace("/");
    },
  });
};
