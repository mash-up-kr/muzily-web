import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import {
  BottomButton,
  Layout,
  Spacer,
  Toast,
  TopBar,
  TopBarIconButton,
} from "~/components/uis";
import { withRouteGuard } from "~/hocs";
import { useRoomsQuery } from "~/hooks/api";

const RoomCreatePage: NextPage = withRouteGuard(
  { CONNECTED: true },
  "/login",
  () => {
    const [value, setValue] = useState("");
    const router = useRouter();
    const handleClick = () => {
      router.push({
        pathname: "/rooms/create/mood",
        query: { roomName: value },
      });
    };
    const roomsQuery = useRoomsQuery();

    useEffect(() => {
      if (roomsQuery.isSuccess) {
        Toast.show(
          "이미 해당 계정에서 생성한 방이 존재합니다.\n계정 당 1개의 방만 생성할 수 있습니다"
        );
        router.replace("/");
      }
    }, [roomsQuery.isSuccess, router]);

    if (roomsQuery.isLoading) {
      return null;
    }

    if (roomsQuery.isError) {
      return (
        <Layout screenColor="linear-gradient(#000, 90%, #01356E)">
          <TopBar leftIconButton={<TopBarIconButton iconName="arrow-left" />}>
            방 만들기
          </TopBar>
          <S.Container>
            <S.Title>나만의 방 이름을 만들어보세요!</S.Title>
            <S.Input
              value={value}
              maxLength={12}
              onChange={(e) => setValue(e.target.value)}
              placeholder="방 이름"
            />
            <S.NoticeTextWrapper gap={4}>
              <Image
                src={`/images/info-circle-mono.svg`}
                alt="icon"
                width={14}
                height={14}
              />
              <S.NoticeText>
                최대 빈칸 포함 12자까지 입력 가능해요.
                <br />
                이후에 언제든지 변경할 수 있습니다:)
              </S.NoticeText>
            </S.NoticeTextWrapper>
          </S.Container>
          <BottomButton
            label="다음"
            disabled={value.length === 0}
            onClick={handleClick}
          />
        </Layout>
      );
    }

    return null;
  }
);

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    height: calc(100% - 104px);
    padding: 20px 0;
  `,
  Title: styled.h3`
    font-size: 18px;
    font-weight: 500;
  `,
  Input: styled.input`
    width: 100%;
    margin-top: 32px;
    text-align: center;
    font-size: 36px;
    color: white;
    border: none;
    background: none;
    :focus {
      outline: none;
    }
  `,
  NoticeTextWrapper: styled(Spacer)`
    position: absolute;
    bottom: 32px;
    align-items: flex-start;
  `,
  NoticeText: styled.span`
    font-size: 13px;
    color: #8e96a0;
  `,
};

export default RoomCreatePage;
