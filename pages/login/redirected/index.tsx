import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { MemberInfo } from "~/contexts";
import { useAuthRedirected } from "~/features/auth/redirected";

const LoginRedirectedPage: NextPage = () => {
  const router = useRouter();
  const { memberInfo } = MemberInfo.use();

  if (router.query.code && memberInfo.accountConnectType === "UNCONNECTED") {
    return <GetServiceToken />;
  }

  return <div>router.query.code를 받아오는 중입니다.</div>;
};

export default LoginRedirectedPage;

const GetServiceToken = () => {
  const { isLoading, isError } = useAuthRedirected();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return null;
};
