import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { Spacer, TopBar, TopBarIconButton, TypingText } from "~/components/uis";
import { withRouteGuard } from "~/hocs";
import { useRoomsQuery } from "~/hooks/api";

const HomePage: NextPage = withRouteGuard(
  { UNCONNECTED: false, CONNECTED: true },
  "/login",
  () => {
    const [isOpenLine2, setIsOpenLine2] = useState(false);
    const [isOpenCTA, setIsOpenCTA] = useState(false);
    const [roomTitle, setRoomTitle] = useState("");
    const router = useRouter();

    const { data, isLoading, isFetching, isError } = useRoomsQuery();

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      router.push({ pathname: "/rooms/create" });
    };

    useEffect(() => {
      if (data) {
        const { roomId } = data;

        router.replace(`/rooms/${roomId}?isHost=true`);
      }
    }, [data]);

    if ((isFetching || isLoading) && isError) {
      return <div>Loading, Fetching</div>;
    }

    return (
      <>
        <TopBar leftIconButton={<TopBarIconButton iconName="star" />} />
        <S.Form onSubmit={onSubmit}>
          <S.InviteContainer>
            <TypingText
              textList={[
                "# 가족들과 함께",
                "# 자동차에서 친구들과",
                "# 방송에서 라이브로",
                "# 친구들과 함께",
              ]}
              typingTime={100}
              onTypingEnd={() => setIsOpenLine2(true)}
              style={{
                fontSize: 23,
                background: "#333333",
                padding: "8px 12px",
                borderRadius: 12,
                height: 44,
              }}
            />

            <S.Spacer></S.Spacer>
            <S.Header>
              <TypingText
                textList={[`함께 만드는`]}
                typingTime={30}
                onTypingEnd={() => setIsOpenLine2(true)}
              />
              {isOpenLine2 && (
                <TypingText
                  textList={[`모두의 플레이리스트`]}
                  typingTime={30}
                  onTypingEnd={() => setIsOpenCTA(true)}
                />
              )}
            </S.Header>

            {isOpenCTA && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, y: [0, 0, 0, 10, 0, 10, 0] }}
                style={{ display: "inline" }}
              >
                <Spacer type="vertical" align={"center"}>
                  <S.CreateRoomButton type="submit">
                    방 만들기
                  </S.CreateRoomButton>
                  <S.Description>지금 바로 3초만에 만들어보세요!</S.Description>
                </Spacer>
              </motion.div>
            )}
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
  Description: styled.div`
    margin-top: 18px;
    font-size: 14px;
    line-height: 22.4px;
    color: #d9d9d9;
    font-style: normal;
    font-weight: 500;
  `,
};
