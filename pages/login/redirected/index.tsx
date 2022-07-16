import React, { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { MemberInfo } from "~/contexts";
import { useAuthRedirected } from "~/features/auth/redirected";
import { useLocalToken } from "~/hooks/domains";

const LoginRedirectedPage: NextPage = () => {
  const router = useRouter();

  if (router.query.code) {
    return <GetServiceToken />;
  }

  return <div>router.query.code를 받아오는 중입니다.</div>;
};

export default LoginRedirectedPage;

const GetServiceToken = () => {
  const [localToken, setLocalToken] = useLocalToken();
  const router = useRouter();

  const { refetchMemberInfo } = MemberInfo.use();

  const { isLoading, isError, isSuccess, data } = useAuthRedirected({
    code: `${router.query.code}`,
  });

  useEffect(() => {
    if (isSuccess) {
      setLocalToken(data.token);
      refetchMemberInfo();
    }
  }, [isSuccess, setLocalToken, data, refetchMemberInfo]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (isSuccess) {
    router.replace("/");
  }

  return null;
};
