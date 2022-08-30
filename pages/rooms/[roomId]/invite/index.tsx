import React, { useEffect } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import {
  Skeleton,
  Spacer,
  Toast,
  TopBar,
  TopBarIconButton,
} from "~/components/uis";
import { MemberInfo } from "~/contexts";
import {
  usePutRoomInvitationMutation,
  useRoomInvitationQuery,
} from "~/hooks/api";

const RoomInvitePage: NextPage = () => {
  const router = useRouter();
  const { roomId, inviteKey } = router.query;

  useEffect(() => {
    if (router.isReady) {
      if (typeof inviteKey !== "string") {
        Toast.show("유효하지 않은 초대장입니다.", {
          status: "error",
          delay: 0,
        });
        router.replace("/");
      }
    }
  }, [router.isReady]);

  const { isFetching, isLoading, data } = useRoomInvitationQuery(
    inviteKey as string
  );
  const { mutate } = usePutRoomInvitationMutation(inviteKey as string);

  const onJoinClick = async () => {
    if (data !== undefined && data.currentUser.role === null) {
      await mutate(inviteKey as string);
    }
    await router.push(`/rooms/${roomId}/`);
  };

  if (isFetching || isLoading || data === undefined) {
    return (
      <Spacer
        type="vertical"
        align="center"
        justify="end"
        style={{ height: "100%", paddingBottom: 16 }}
      >
        <div>
          <Skeleton.Paragraph fontSize={12} line={1} lineBreak={3} />
          <Skeleton.Box width={180} height={30} />
          <br />
          <br />
          <br />
          <Spacer type="vertical" align="center" gap={16}>
            <Skeleton.Box width={100} height={20} />
            <Skeleton.Box width={200} height={40} />
            <br />
            <br />
            <br />
            <br />
            <br />
            <Skeleton.Box width={280} height={160} />
          </Spacer>
        </div>
      </Spacer>
    );
  }

  return (
    <>
      <TopBar
        leftIconButton={<TopBarIconButton iconName="star" boxSize={29} />}
        rightIconButton={
          <MemberInfo.Only>
            {({ memberInfo }) =>
              memberInfo.accountConnectType === "UNCONNECTED" ? (
                <S.TopBarRightItem
                  onClick={() => {
                    router.push("/login");
                  }}
                >
                  로그인
                </S.TopBarRightItem>
              ) : (
                <></>
              )
            }
          </MemberInfo.Only>
        }
      />
      <S.InviteContainer>
        <S.MuzilyTitle>
          <S.LightSpan>함께 만드는 플레이리스트, </S.LightSpan>
          <S.BoldSpan>MUZILY</S.BoldSpan>
        </S.MuzilyTitle>
        <S.RoomTitle>{data.name}</S.RoomTitle>
        <S.RoomStatusContainer>
          <S.UserNumberStatusSpan>
            <Image
              src="/images/icon-user-mono.svg"
              alt=""
              width={12}
              height={12}
            />
            {data.participantsCount}
          </S.UserNumberStatusSpan>
          <S.PlayListStatusSpan>
            <Image
              src="/images/music-note-white.svg"
              alt=""
              width={12}
              height={12}
            />
            {data.playListItemsCount}
          </S.PlayListStatusSpan>
        </S.RoomStatusContainer>
        <S.RoomJoinButton onClick={onJoinClick}>방 입장하기</S.RoomJoinButton>
      </S.InviteContainer>
      <S.BottomGifImage src="/images/invite.gif"></S.BottomGifImage>
    </>
  );
};

const S = {
  TopBarRightItem: styled.div`
    cursor: pointer;
    color: #007aff;
    font-weight: 700;
    font-size: 17px;
    line-height: 155%;
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
  `,

  PlayListStatusSpan: styled.span`
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
