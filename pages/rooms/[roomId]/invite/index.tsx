import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { TopBar, TopBarIconButton } from "~/components/uis";

const RoomInvitePage: NextPage = () => {
  const router = useRouter();
  const { roomId } = router.query;

  const onJoinClick = () => {
    router.push(`/rooms/${roomId}/`);
  };

  return (
    <>
      <TopBar
        leftIconButton={<TopBarIconButton iconName="star" />}
        rightIconButton={<S.TopBarRightItem>로그인</S.TopBarRightItem>}
      />
      <S.InviteContainer>
        <S.MuzilyTitle>
          <S.LightSpan>함께 만드는 플레이리스트, </S.LightSpan>
          <S.BoldSpan>MUZILY</S.BoldSpan>
        </S.MuzilyTitle>
        <S.RoomTitle>매쇼~쉬는탐</S.RoomTitle>
        <S.RoomStatusContainer>
          <S.UserNumberStatusSpan>98</S.UserNumberStatusSpan>
          <S.PlayListStatusSpan>24</S.PlayListStatusSpan>
        </S.RoomStatusContainer>
        <S.RoomJoinButton onClick={onJoinClick}>방 입장하기</S.RoomJoinButton>
      </S.InviteContainer>
      <S.BottomGifImage src="/images/invite.gif"></S.BottomGifImage>
    </>
  );
};

const S = {
  TopBarRightItem: styled.div`
    color: #007aff;
    font-weight: 700;
    font-size: 17px;
    font-height: 155%;
    letter-spacing: -0.478073px;

    display: flex;
    align-items: center;
  `,
  LightSpan: styled.span`
    font-weight: 500;
    font-size: 14px;
    line-height: 22.4px;
    color: #d9d9d9;
  `,

  BoldSpan: styled.span`
    font-weight: 800;
    font-size: 14px;
    line-height: 22.4px;
    color: #d9d9d9;
  `,

  InviteContainer: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 80%;
  `,

  MuzilyTitle: styled.div`
    font-weight: 800;
    font-size: 14px;
    line-height: 22.4px;
  `,

  RoomTitle: styled.div`
    font-weight: 700;
    font-size: 37px;
    line-height: 57.35px;

    color: white;
  `,

  RoomJoinButton: styled.div`
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
  `,

  RoomStatusContainer: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 24px;

    margin-top: 6px;
  `,

  UserNumberStatusSpan: styled.span`
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
    & :before {
      content: "";
      display: block;
      background: url("/images/usernumber.png") no-repeat;
      width: 10px;
      height: 10px;
      float: left;
    }
  `,

  PlayListStatusSpan: styled.span`
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
    & :before {
      content: "";
      display: block;
      background: url("/images/playlistnumber.png") no-repeat;
      background-size: contain;
      width: 10px;
      height: 10px;
      margin-left: 5px;
      float: left;
    }
  `,

  BottomGifImage: styled.img`
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: -1;
    width: 100%;
    float: left;
  `,
};

export default RoomInvitePage;
