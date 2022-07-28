import React, { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Layout, TopBar, TopBarIconButton } from "~/components/uis";
import { withRouteGuard } from "~/hocs";
import {
  StyledTopBarRightItem,
  StyledInviteContainer,
  StyeldForm,
  StyledRoomTextContainer,
  StyledRoomInputText,
  StyledSpacer,
  StyledHeader,
  StyledCreateRoomButton,
  StyledDescripion,
} from "./styled";

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
            <StyledTopBarRightItem>로그인</StyledTopBarRightItem>
          }
        />
        <StyeldForm onSubmit={onSubmit}>
          <StyledInviteContainer>
            <StyledRoomTextContainer>
              <StyledRoomInputText
                type="text"
                onChange={(e) => setRoomTitle(e.target.value)}
              ></StyledRoomInputText>
            </StyledRoomTextContainer>
            <StyledSpacer></StyledSpacer>
            <StyledHeader>
              함께 만드는
              <br />
              모두의 플레이리스트
            </StyledHeader>
            <StyledCreateRoomButton type="submit">
              방 만들기
            </StyledCreateRoomButton>
            <StyledDescripion>지금 바로 3초만에 만들어보세요!</StyledDescripion>
          </StyledInviteContainer>
        </StyeldForm>
      </Layout>
    );
  }
);

export default SignupPage;
