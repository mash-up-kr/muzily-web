import React, { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import {
  LoadingButton,
  Skeleton,
  Spacer,
  TopBar,
  TopBarIconButton,
  TypingText,
} from "~/components/uis";
import { MemberInfo } from "~/contexts";
import { withRouteGuard } from "~/hocs";
import {
  usePostLogoutMutation,
  useRoomQuery,
  useRoomsQuery,
} from "~/hooks/api";

const typingTextList = [
  "# 팀플에서 팀원과",
  "# 여행에서 친구와",
  "# 가게에서 손님과",
];

const HomePage: NextPage = withRouteGuard(
  { UNCONNECTED: true, CONNECTED: true },
  "/login",
  () => {
    const [isRouting, setIsRouting] = useState(false);

    const [GIFImage, setGIFImage] = useState<
      | "/images/main_animation_1_team.gif"
      | "/images/main_animation_2_travel.gif"
      | "/images/main_animation_3_shop.gif"
      | ""
    >("/images/main_animation_1_team.gif");

    const router = useRouter();

    const roomsQuery = useRoomsQuery();
    const roomQuery = useRoomQuery(
      roomsQuery.isSuccess ? roomsQuery.data.roomId : 0,
      {
        enabled: roomsQuery.isSuccess,
        retry: 0,
      }
    );

    const postLogout = usePostLogoutMutation();

    useEffect(() => {
      if (
        GIFImage === "/images/main_animation_1_team.gif" ||
        GIFImage === "/images/main_animation_2_travel.gif" ||
        GIFImage === "/images/main_animation_3_shop.gif"
      ) {
        setTimeout(() => {
          setGIFImage("");
        }, 1900);
      }
    }, [GIFImage]);

    const handleTypingEnd = useCallback(
      ({ textListIndex }: { textListIndex: number }) => {
        if (textListIndex === 0) {
          setGIFImage("/images/main_animation_2_travel.gif");
        }
        if (textListIndex === 1) {
          setGIFImage("/images/main_animation_3_shop.gif");
        }
        if (textListIndex === 2) {
          setGIFImage("/images/main_animation_1_team.gif");
        }
      },
      []
    );

    return (
      <>
        <TopBar
          leftIconButton={<TopBarIconButton iconName="logo" boxSize={29} />}
          rightIconButton={
            <MemberInfo.Only>
              {({ memberInfo }) => {
                return (
                  <div
                    onClick={
                      memberInfo.accountConnectType === "CONNECTED"
                        ? () => {
                            const isConfirmed =
                              window.confirm("정말 로그아웃하시곘습니까?");

                            if (!isConfirmed) {
                              return;
                            }

                            postLogout.mutate(null, {
                              onSuccess: () => {
                                window.alert("로그아웃에 성공하였습니다.");

                                localStorage.clear();
                                router.replace("/");
                              },
                              onError: (error: AxiosError) => {
                                if (error instanceof AxiosError) {
                                  window.alert(error.response?.data.message);
                                }
                                console.error(error);
                              },
                            });
                          }
                        : () => {
                            router.push({ pathname: "/login" });
                          }
                    }
                    css={css`
                      cursor: pointer;
                      color: #007aff;
                      font-weight: 700;
                      font-size: 17px;
                      line-height: 155%;
                      letter-spacing: -0.478073px;
                      display: flex;
                      align-items: center;
                    `}
                  >
                    {memberInfo.accountConnectType === "CONNECTED"
                      ? "로그아웃"
                      : "로그인"}
                  </div>
                );
              }}
            </MemberInfo.Only>
          }
        />
        <S.Wrapper>
          <S.InviteContainer>
            <div style={{ height: 46 }}>
              <TypingText
                textList={typingTextList}
                typingTime={50}
                typingEndDelay={1600}
                style={{
                  fontSize: 22,
                  background: "#1F1D1F",
                  padding: "8px 12px",
                  borderRadius: 8,
                  height: 43,
                }}
                onTypingEnd={handleTypingEnd}
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
                      <div
                        css={css`
                          height: 58px;
                        `}
                      />
                      <LoadingButton
                        loading={isRouting}
                        disabled={isRouting}
                        onClick={() => {
                          setIsRouting(true);
                          if (roomQuery.isSuccess && roomsQuery.isSuccess) {
                            router.replace(
                              `/rooms/${roomsQuery.data.roomId}?isHost=true`
                            );
                          } else {
                            router.push({ pathname: "/rooms/create" });
                          }
                        }}
                      >
                        {roomQuery.isSuccess && roomsQuery.isSuccess
                          ? "내 방 입장하기"
                          : "방 만들기"}
                      </LoadingButton>
                      <S.Description>
                        지금 바로 3초만에 만들어보세요!
                      </S.Description>
                    </Spacer>
                  </motion.div>
                </>
              )}
            </S.Header>
          </S.InviteContainer>

          <S.BottomGifImage src={GIFImage} />
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
  Description: styled.div`
    margin-top: 18px;
    font-size: 14px;
    line-height: 22.4px;
    color: #d9d9d9;
    font-style: normal;
    font-weight: 500;
  `,
  BottomGifImage: styled.img`
    position: absolute;
    object-fit: cover;
    height: 52vh;
    bottom: 0;
    z-index: -1;
    float: left;
  `,
};
