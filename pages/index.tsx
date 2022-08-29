import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import {
  Skeleton,
  Spacer,
  TopBar,
  TopBarIconButton,
  TypingText,
} from "~/components/uis";
import { withRouteGuard } from "~/hocs";
import { useRoomQuery, useRoomsQuery } from "~/hooks/api";

const HomePage: NextPage = withRouteGuard(
  { UNCONNECTED: true, CONNECTED: true },
  "/login",
  () => {
    const router = useRouter();

    const roomsQuery = useRoomsQuery();
    const roomQuery = useRoomQuery(
      roomsQuery.isSuccess ? roomsQuery.data.roomId : 0,
      {
        enabled: roomsQuery.isSuccess,
        retry: 0,
      }
    );

    return (
      <>
        <TopBar leftIconButton={<TopBarIconButton iconName="star" />} />
        <S.Wrapper>
          <S.InviteContainer>
            <div style={{ height: 46 }}>
              <TypingText
                textList={[
                  "# 가게에서 손님과",
                  "# 여행에서 친구와",
                  "# 팀플에서 팀원과",
                ]}
                typingTime={50}
                typingEndDelay={1300}
                style={{
                  fontSize: 22,
                  background: "#1F1D1F",
                  padding: "8px 12px",
                  borderRadius: 8,
                  height: 43,
                }}
              />
            </div>
            <S.Spacer></S.Spacer>
            <S.Header>
              {roomsQuery.isLoading || roomQuery.isLoading ? (
                <>
                  <Skeleton.Box height={27} width={200} />
                  <Skeleton.Box height={27} width={260} />
                  <br />
                  <br />
                  <Skeleton.Box height={40} width={200} />
                  <Skeleton.Box height={10} width={240} />
                </>
              ) : (
                <>
                  <div
                    css={css`
                      font-size: 27;
                      text-align: center;
                    `}
                  >
                    <div>
                      {roomQuery.isSuccess ? (
                        <>
                          <div>{roomQuery.data.name}</div>
                          <div
                            css={css`
                              font-size: 16px;
                              color: rgba(255, 255, 255, 0.6);
                            `}
                          >
                            {roomQuery.data.mood.moodDescription}
                          </div>
                        </>
                      ) : (
                        <>
                          <div>함께 만드는</div>
                          <div>모두의 플레이리스트</div>
                        </>
                      )}
                    </div>
                  </div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, y: [0, 0, 0, 10, 0, 10, 0] }}
                    style={{ display: "inline" }}
                  >
                    <Spacer type="vertical" align={"center"}>
                      <S.CreateRoomButton
                        onClick={() =>
                          roomQuery.isSuccess && roomsQuery.isSuccess
                            ? router.replace(
                                `/rooms/${roomsQuery.data.roomId}?isHost=true`
                              )
                            : router.push({ pathname: "/rooms/create" })
                        }
                      >
                        {roomQuery.isSuccess && roomsQuery.isSuccess
                          ? "내가 만든 방 입장하기"
                          : "방 만들기"}
                      </S.CreateRoomButton>
                      <S.Description>
                        지금 바로 3초만에 만들어보세요!
                      </S.Description>
                    </Spacer>
                  </motion.div>
                </>
              )}
            </S.Header>
          </S.InviteContainer>
        </S.Wrapper>
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
  Wrapper: styled.div`
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
    padding: 0 24px;
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
