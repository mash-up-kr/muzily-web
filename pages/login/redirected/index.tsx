import React from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { Spinner } from "~/components/uis";
import { MemberInfo } from "~/contexts";
import { useAuthRedirected } from "~/features/auth/redirected";

const LoginRedirectedPage: NextPage = () => {
  const router = useRouter();

  if (router.query.code) {
    return (
      <MemberInfo.Only fallback={<Spinner.FullPage />}>
        {({ memberInfo }) => (
          <>
            {memberInfo.accountConnectType === "UNCONNECTED" ? (
              <GetServiceToken />
            ) : (
              <div>
                {memberInfo.nickname}님이 연결 되었습니다.
                {memberInfo.profileUrl && <Image src={memberInfo.profileUrl} />}
              </div>
            )}
          </>
        )}
      </MemberInfo.Only>
    );
  }

  return <Spinner.FullPage />;
};

export default LoginRedirectedPage;

const GetServiceToken = () => {
  const { isLoading, isError } = useAuthRedirected();

  if (isLoading) {
    return <Spinner.FullPage />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return null;
};
