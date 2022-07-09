import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAuthRedirected } from "~/features/auth/redirected";

const LoginRedirectedPage: NextPage = () => {
  const router = useRouter();

  if (router.query.code) {
    return <GetServiceToken />;
  }

  return <div>router.query.code를 받아오는 중입니다.</div>;
};

export default LoginRedirectedPage;

const GetServiceToken = () => {
  const router = useRouter();

  const authRedirected = useAuthRedirected({
    code: `${router.query.code}`,
  });

  if (authRedirected.isSuccess) {
    router.replace("/");
  }

  return null;
};
