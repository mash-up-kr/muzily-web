import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { MemberInfo } from "~/contexts";
import { useAuthRedirected } from "~/features/auth/redirected";

const LoginRedirectedPage: NextPage = () => {
  const router = useRouter();

  if (router.query.code) {
    return (
      <MemberInfo.Only fallback={"loading"}>
        {({ memberInfo }) => (
          <>
            {memberInfo.accountConnectType === "UNCONNECTED" ? (
              <GetServiceToken />
            ) : (
              "memberInfo.accountConnectType가 UNCONNECTED가 아닙니다."
            )}
          </>
        )}
      </MemberInfo.Only>
    );
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
