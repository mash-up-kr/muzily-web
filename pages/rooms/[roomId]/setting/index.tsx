import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { AxiosError } from "axios";
import { BottomButton, TopBar, TopBarIconButton } from "~/components/uis";
import { useDeleteRoomMutation, usePostLogoutMutation } from "~/hooks/api";
import type { Mood, MoodWithImageName } from "~/types/rooms";

const tokenKey = process.env.NEXT_PUBLIC_LOCAL_TOKEN_KEY as string;

const moodConstants: MoodWithImageName[] = [
  {
    name: "# 조용~ 집중 빡 공부 모드",
    emojiType: "BOOK",
    emojiTypeImageName: "book-3d",
  },
  {
    name: "# 쉣댓 부레 엉덩이~! 흔들어버려",
    emojiType: "MIRROR_BALL",
    emojiTypeImageName: "mirror-3d",
  },
  {
    name: "# 잔잔한 내적 댄스 유발",
    emojiType: "HEART",
    emojiTypeImageName: "heart-3d",
  },
];

const RoomSettingPage: NextPage = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState(-1);

  useEffect(() => {
    const { roomId } = router.query as { roomId: string };
    setRoomId(Number(roomId));
  }, [router.query]);

  const deleteRoomMutation = useDeleteRoomMutation(Number(roomId));
  const postLogout = usePostLogoutMutation();

  const onClickEditComplete = () => {};

  const onClickDeleteRoom = () => {
    const isConfirmed = window.confirm("정말 삭제하시곘습니까?");

    if (!isConfirmed) {
      return;
    }

    deleteRoomMutation.mutate(0, {
      onSuccess: () => {
        window.alert("방이 삭제되었습니다.");
        localStorage.removeItem(tokenKey);
        router.replace("/");
      },
      onError: (error: AxiosError) => {
        if (error instanceof AxiosError) {
          window.alert(error.response?.data.message);
        }
        console.error(error);
      },
    });
  };

  const onClickAuthLogout = () => {
    const isConfirmed = window.confirm("정말 로그아웃하시곘습니까?");

    if (!isConfirmed) {
      return;
    }

    postLogout.mutate(null, {
      onSuccess: () => {
        window.alert("로그아웃에 성공하였습니다.");

        router.replace("/");
      },
      onError: (error: AxiosError) => {
        if (error instanceof AxiosError) {
          window.alert(error.response?.data.message);
        }
        console.error(error);
      },
    });
  };

  return (
    <>
      <TopBar leftIconButton={<TopBarIconButton iconName="arrow-left" />}>
        설정
      </TopBar>
      <S.Container>
        <S.Title>
          매쇼~쉬는탐
          <S.IconWrapper>
            <Image
              src={`/images/edit.svg`}
              alt={"icon"}
              width={18}
              height={18}
            />
          </S.IconWrapper>
        </S.Title>
        <S.MoodContainer>
          내 방의 무드
          <S.MoodButtonGroup>
            <span># 잔잔한 내적 댄스 유발</span>
            <S.ChangeMoodButton>변경</S.ChangeMoodButton>
          </S.MoodButtonGroup>
        </S.MoodContainer>
        <S.HorizontalLine></S.HorizontalLine>
        <S.AnchorLink href="#" onClick={onClickDeleteRoom}>
          방 삭제
        </S.AnchorLink>
        <S.AnchorLink href="#" onClick={onClickAuthLogout}>
          로그아웃
        </S.AnchorLink>
      </S.Container>
      <BottomButton label="수정 완료" onClick={onClickEditComplete} />
    </>
  );
};

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: leading;
    align-items: leading;
    position: relative;
    height: calc(100% - 104px);
    padding: 45px 0px 20px 20px;
  `,

  Title: styled.div`
    font-size: 27px;
    font-weight: 700;
    line-height: 32px;
  `,

  IconWrapper: styled.button`
    cursor: pointer;
    width: 36px;
    height: 36px;
    background-color: transparent;
    border: none;
    margin-left: 8px;
  `,

  MoodContainer: styled.div`
    margin-top: 40px;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: -0.45px;
    color: rgba(255, 255, 255, 0.75);
  `,

  MoodButtonGroup: styled.button`
    height: 58px;
    width: calc(100% - 20px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 22px;
    border: none;
    background: rgba(64, 73, 83, 0.85);
    color: white;
    font-weight: 700;
    font-size: 16px;
    border-radius: 20px;
    margin-top: 10px;
  `,

  ChangeMoodButton: styled.button`
    border: none;
    background-color: transparent;
    font-weight: 300;
    font-size: 12px;
    line-height: 155%;
    color: white;
  `,

  HorizontalLine: styled.hr`
    width: 100%;
    margin-top: 22px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  `,

  AnchorLink: styled.a`
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
    letter-spacing: -0.45px;
    text-decoration-line: underline;
    color: rgba(255, 255, 255, 0.75);
    margin-top: 20px;
  `,
};

export default RoomSettingPage;
