import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styled from "@emotion/styled";
import { KakaoLoginButton } from "~/components/domains";
import { TopBar, TopBarIconButton } from "~/components/uis";
import { withRouteGuard } from "~/hocs";

const LoginPage: NextPage = withRouteGuard({ UNCONNECTED: true }, "/", () => {
  return (
    <>
      <TopBar leftIconButton={<TopBarIconButton iconName="star" />} />
      <Head>
        <title>Musily</title>
        <meta
          name="description"
          content="좋아하는 음악을 카페에서 틀고 싶다고?"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <S.Container>
        <S.Header>
          방을 만드려면<br></br>
          로그인이 필요해요
        </S.Header>
        <KakaoLoginButton
          restApiKey={
            process.env.NEXT_PUBLIC_KAKAO_APP_KEY_REST_API_KEY as string
          }
          redirectUri={
            process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI as string
          }
        ></KakaoLoginButton>
      </S.Container>
    </>
  );
});

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 42px;
    gap: 40px;
  `,
  Header: styled.div`
    font-weight: 600;
    font-size: 24px;
    line-height: 34.8px;
    letter-spacing: -0.25px;
    color: white;
  `,
};

export default LoginPage;
