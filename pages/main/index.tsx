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
          rightIconButton={<S.TopBarRightItem>로그인</S.TopBarRightItem>}
        />
        <S.Form onSubmit={onSubmit}>
          <S.InviteContainer>
            <S.RoomTextContainer>
              <S.RoomInputText
                type="text"
                onChange={(e) => setRoomTitle(e.target.value)}
              ></S.RoomInputText>
            </S.RoomTextContainer>
            <S.Spacer></S.Spacer>
            <S.Header>
              함께 만드는
              <br />
              모두의 플레이리스트
            </S.Header>
            <S.CreateRoomButton type="submit">방 만들기</S.CreateRoomButton>
            <S.Descripion>지금 바로 3초만에 만들어보세요!</S.Descripion>
          </S.InviteContainer>
        </S.Form>
      </Layout>
    );
  }
);

export default SignupPage;
