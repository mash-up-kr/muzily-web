import React from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { useQuery } from "react-query";
import { Spinner } from "~/components/uis";
import { MemberInfo } from "~/contexts";
import { useLocalToken } from "~/hooks/domains";

const defaultEndPoint = process.env
  .NEXT_PUBLIC_SERVER_DEFAULT_END_POINT as string;

export const useAuthRedirected = () => {
  const [localToken, setLocalToken] = useLocalToken();
  const router = useRouter();
  const { refetchMemberInfo } = MemberInfo.use();

  return useQuery(
    ["auth", "code"],
    async () => {
      const { data } = await axios.post<{ token: string }>(
        `${defaultEndPoint}/api/v1/auth`,
        {
          code: `${router.query.code}`,
          redirectUri: process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI,
          socialType: "KAKAO",
        }
      );

      setLocalToken(data.token);

      return data;
    },
    {
      onSuccess: async ({ token }) => {
        refetchMemberInfo();

        try {
          const { data } = await axios.get<{ roomId: number }>(
            `${defaultEndPoint}/api/v1/rooms`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(data);
          const { roomId } = data;

          router.replace(`/rooms/${roomId}?isHost=true`);
        } catch (error) {
          console.log(error);
          router.replace("/");
        }
      },
    }
  );
};

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
