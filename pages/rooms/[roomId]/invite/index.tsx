import React from "react";
import type { NextPage } from "next";
import styled from "@emotion/styled";
import { Layout, TopBar, TopBarIconButton } from "~/components/uis";

const RoomInvitePage: NextPage = () => {
  return (
    <Layout screenColor="black">
      <TopBar
        leftIconButton={<TopBarIconButton iconName="star" />}
        rightIconButton={<StyledTopBarRightItem>로그인</StyledTopBarRightItem>}
      />
      <StyledInviteContainer>
        <StyledMuzilyTitle>
          <StyledLightSpan>함께 만드는 플레이리스트, </StyledLightSpan>
          <StyledBoldSpan>MUZILY</StyledBoldSpan>
        </StyledMuzilyTitle>
        <StyledRoomTitle>매쇼~쉬는탐</StyledRoomTitle>
        <StyledRoomStatusContainer>
          <StyledUserNumberStatusSpan>98</StyledUserNumberStatusSpan>
          <StyledPlayListStatusSpan>24</StyledPlayListStatusSpan>
        </StyledRoomStatusContainer>
        <StyledRoomJoinButton>방 입장하기</StyledRoomJoinButton>
      </StyledInviteContainer>
      <BottomGifImage src="/images/invite.gif"></BottomGifImage>
    </Layout>
  );
};

const StyledTopBarRightItem = styled.div`
  color: #007aff;
  font-weight: 700;
  font-size: 17px;
  font-height: 155%;
  letter-spacing: -0.478073px;

  display: flex;
  align-items: center;
`;

const StyledLightSpan = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 22.4px;
  color: #d9d9d9;
`;

const StyledBoldSpan = styled.span`
  font-weight: 800;
  font-size: 14px;
  line-height: 22.4px;
  color: #d9d9d9;
`;

const StyledInviteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 80%;
`;

const StyledMuzilyTitle = styled.div`
  font-weight: 800;
  font-size: 14px;
  line-height: 22.4px;
`;

const StyledRoomTitle = styled.div`
  font-weight: 700;
  font-size: 37px;
  line-height: 57.35px;

  color: white;
`;

const StyledRoomJoinButton = styled.div`
  cursor: pointer;

  width: 149px;
  height: 51px;
  color: white;

  background: #007aff;
  border-radius: 15px;

  text-align: center;
  vertical-align: center;

  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: -0.450631px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 29px;
`;

const StyledRoomStatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;

  margin-top: 6px;
`;

const StyledUserNumberStatusSpan = styled.span`
  & {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 5px 14px;
    gap: 6px;

    width: 65px;
    height: 33px;

    background: #252525;
    border-radius: 5px;

    color: white;
    font-size: 15px;
    line-height: 155%;
    font-weight: 500;
    line-spacing: -0.544648px;
  }
  &: before {
    content: "";
    display: block;
    background: url("/images/usernumber.png") no-repeat;
    width: 10px;
    height: 10px;
    float: left;
  }
`;

const StyledPlayListStatusSpan = styled.span`
  & {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 5px 14px;
    gap: 6px;

    width: 65px;
    height: 33px;

    background: #252525;
    border-radius: 5px;

    color: white;
    font-size: 15px;
    line-height: 155%;
    font-weight: 500;
    line-spacing: -0.544648px;
  }
  &: before {
    content: "";
    display: block;
    background: url("/images/playlistnumber.png") no-repeat;
    background-size: contain;
    width: 10px;
    height: 10px;
    margin-left: 5px;
    float: left;
  }
`;

const BottomGifImage = styled.img`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  float: left;
`;

export default RoomInvitePage;
