import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import axios from "axios";
import { useQuery } from "react-query";
import Emojis from "~/components/domains/Emoji/Emojis";
import { Skeleton, Spacer } from "~/components/uis";
import { MemberInfo } from "~/contexts";
import { useLocalToken } from "~/hooks/domains";

const defaultEndPoint = process.env
  .NEXT_PUBLIC_SERVER_DEFAULT_END_POINT as string;

export const useAuthRedirected = () => {
  const [, setLocalToken] = useLocalToken();
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
          const { roomId } = data;

          router.replace(`/rooms/${roomId}?isHost=true`);
        } catch (error) {
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
      <MemberInfo.Only
        fallback={
          <Spacer type="vertical" justify="center" style={{ height: "100%" }}>
            <div style={{ margin: 16 }}>
              <Skeleton.Circle size={60} />
              <Skeleton.Paragraph fontSize={12} line={5} lineBreak={3} />
            </div>
          </Spacer>
        }
      >
        {({ memberInfo }) => (
          <>
            <Emojis stage={3} />
            {memberInfo.accountConnectType === "UNCONNECTED" ? (
              <GetServiceToken />
            ) : (
              <Spacer
                type="vertical"
                justify="center"
                style={{ height: "100%" }}
              >
                <div style={{ margin: 16 }}>
                  <Skeleton.Circle size={60} />
                  <Skeleton.Paragraph fontSize={12} line={5} lineBreak={3} />
                </div>
              </Spacer>
            )}
          </>
        )}
      </MemberInfo.Only>
    );
  }

  return (
    <Spacer type="vertical" justify="center" style={{ height: "100%" }}>
      <div style={{ margin: 16 }}>
        <Skeleton.Circle size={60} />
        <Skeleton.Paragraph fontSize={12} line={5} lineBreak={3} />
      </div>
    </Spacer>
  );
};

export default LoginRedirectedPage;

const GetServiceToken = () => {
  const { isLoading, isError } = useAuthRedirected();

  if (isLoading) {
    return (
      <Spacer type="vertical" justify="center" style={{ height: "100%" }}>
        <div style={{ margin: 16 }}>
          <Skeleton.Circle size={60} />
          <Skeleton.Paragraph fontSize={12} line={5} lineBreak={3} />
        </div>
      </Spacer>
    );
  }

  if (isError) {
    return <div>Error</div>;
  }

  return null;
};
