import React, { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Layout, TopBar, TopBarIconButton } from "~/components/uis";
import { withRouteGuard } from "~/hocs";
import * as S from "./styled";

const SignupPage: NextPage = withRouteGuard(
  { UNCONNECTED: true },
  "/login",
  () => {
    const [roomTitle, setRoomTitle] = useState("");
    const router = useRouter();

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      router.push({
        pathname: "/rooms/create",
        query: { roomTitle },
      });
    };

    return (
      <Layout screenColor="black">
        <TopBar
          leftIconButton={<TopBarIconButton iconName="star" />}
          rightIconButton={
            <S.StyledTopBarRightItem>로그인</S.StyledTopBarRightItem>
          }
        />
        <S.StyeldForm onSubmit={onSubmit}>
          <S.StyledInviteContainer>
            <S.StyledRoomTextContainer>
              <S.StyledRoomInputText
                type="text"
                onChange={(e) => setRoomTitle(e.target.value)}
              ></S.StyledRoomInputText>
            </S.StyledRoomTextContainer>
            <S.StyledSpacer></S.StyledSpacer>
            <S.StyledHeader>
              함께 만드는
              <br />
              모두의 플레이리스트
            </S.StyledHeader>
            <S.StyledCreateRoomButton type="submit">
              방 만들기
            </S.StyledCreateRoomButton>
            <S.StyledDescripion>
              지금 바로 3초만에 만들어보세요!
            </S.StyledDescripion>
          </S.StyledInviteContainer>
        </S.StyeldForm>
      </Layout>
    );
  }
);

export default SignupPage;
