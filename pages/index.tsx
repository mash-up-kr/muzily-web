import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { TopBar, TopBarIconButton } from "~/components/uis";
import { withRouteGuard } from "~/hocs";
import { useRoomsQuery } from "~/hooks/api";

const HomePage: NextPage = withRouteGuard(
  { UNCONNECTED: false, CONNECTED: true },
  "/login",
  () => {
    const [roomTitle, setRoomTitle] = useState("");
    const router = useRouter();

    const { data, isLoading, isFetching, isError } = useRoomsQuery();

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      router.push({
        pathname: "/rooms/create",
        query: { roomTitle },
      });
    };

    useEffect(() => {
      if (data) {
        const { roomId } = data;

        router.replace(`/rooms/${roomId}?isHost=true`);
      }
    }, [data]);

    if (isFetching || isLoading || data === undefined) {
      return <div>Loading, Fetching</div>;
    }

    if (isError) {
      router.replace("/rooms/create");
    }

    return (
      <>
        <TopBar leftIconButton={<TopBarIconButton iconName="star" />} />
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
            <S.Description>지금 바로 3초만에 만들어보세요!</S.Description>
          </S.InviteContainer>
        </S.Form>
      </>
    );
  }
);

export default HomePage;

const S = {
  TopBarRightItem: styled.div`
    color: #007aff;
    font-weight: 700;
    font-size: 17px;
    line-height: 155%;
    letter-spacing: -0.478073px;
    display: flex;
    align-items: center;
    background-color: black;
    border: none;
    cursor: pointer;
  `,
  InviteContainer: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 60px;
    gap: 6px;
  `,
  Form: styled.form`
    width: 100%;
    max-width: 100vw;
    min-height: 100vh;
    height: 100vh;
    min-height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    padding-top: 48px;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  `,
  RoomTextContainer: styled.div`
    width: 100%;
    height: 45px;
    padding: 4px 8px;
    background-color: #333;
    border-radius: 7px;
  `,
  RoomInputText: styled.input`
    width: 100%;
    height: 100%;
    background-color: #333;
    border: none;
    color: white;
    font-size: 26px;
  `,
  Spacer: styled.div`
    width: 100%;
    height: 2px;
  `,
  Header: styled.div`
    font: "Apple SD Gothic Neo";
    font-weight: 700;
    font-size: 26px;
    color: white;
    text-align: center;
    line-height: 43.2px;
  `,
  CreateRoomButton: styled.button`
    margin-top: 58px;
    width: 149px;
    height: 51px;
    background-color: #007aff;
    border-radius: 15px;
    color: white;
    font-weight: 700;
    font-size: 20px;
    line-height: 23.87px;
    letter-spacing: -0.45px;
    text-align: center;
    border: none;
    cursor: pointer;
  `,
  Description: styled.span`
    margin-top: 18px;
    font-size: 14px;
    line-height: 22.4px;
    color: #d9d9d9;
    font-style: normal;
    font-weight: 500;
  `,
};
