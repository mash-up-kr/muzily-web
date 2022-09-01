import React, { useEffect, useMemo, useState } from "react";
import type { NextPage, NextPageContext } from "next";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import type { AxiosError } from "axios";
import { useQueryClient } from "react-query";
import Slider from "react-slick";
import YouTube from "react-youtube";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  NowPlayingCard,
  PlaylistCard,
  AddSongScreen,
  Emoji,
} from "~/components/domains";
import QRCodeCard from "~/components/domains/QRCodeCard";
import RoomSettingScreen from "~/components/domains/RoomSettingScreen";
import {
  Modal,
  Spacer,
  IconButton,
  TopBar,
  TopBarIconButton,
  Skeleton,
  Toast,
} from "~/components/uis";
import { queryKeys } from "~/consts/react-query";
import RoomSocketProvider from "~/contexts/RoomSocket";
import { useGetPlaylistPendingItems } from "~/hooks/api";
import { useRoomQuery } from "~/hooks/api/rooms";
import { useIsMobile } from "~/hooks/commons";
import usePlayerActions from "~/hooks/domains/usePlayerActions";
import { useUpdatePlayerState } from "~/hooks/webSocket";
import { playlistAtomState, proposedPlaylistAtomState } from "~/store/playlist";
import {
  isHostAtomState,
  playerAtomState,
  playlistIdAtomState,
} from "~/store/room";

interface Props {
  isHost: boolean;
}

const RoomPage: NextPage<Props> = ({ isHost }) => {
  const router = useRouter();
  const { roomId } = router.query as { roomId: string };

  return (
    <RoomSocketProvider roomId={roomId}>
      <RoomContentPage isHost={isHost} />
    </RoomSocketProvider>
  );
};

RoomPage.getInitialProps = async (ctx: NextPageContext) => {
  const isHost = ctx.query.isHost === "true";

  return {
    isHost,
  };
};

const INITIAL_SLIDE_INDEX = 1;

const RoomContentPage: NextPage<Props> = () => {
  const router = useRouter();
  const { roomId } = router.query as { roomId: string };

  const {
    isLoading: isLoadingRoomQuery,
    data: roomData,
    isError,
    error,
  } = useRoomQuery(Number(roomId));

  const isHost = useRecoilValue(isHostAtomState);

  const [player, setPlayer] = useState(null);
  const [playerState, setPlayerState] = useRecoilState(playerAtomState);
  const [playlist] = useRecoilState(playlistAtomState);
  const playlistId = useRecoilValue(playlistIdAtomState);
  const proposedPlaylist = useRecoilValue(proposedPlaylistAtomState);
  const { data: pendingData } = useGetPlaylistPendingItems(playlistId, isHost);
  const queryClient = useQueryClient();

  const { playNextMusic } = usePlayerActions();

  const { publish: publishPlayerState } = useUpdatePlayerState(+roomId);

  const currentMusic = useMemo(
    () =>
      playlist.find(
        (item) => item.playlistItemId === playerState.playingMusicId
      ) || playlist[0],
    [playerState.playingMusicId, playlist]
  );

  useEffect(() => {
    if (isError) {
      if ((error as AxiosError<any>).response?.data?.code === "R004") {
        Toast.show((error as AxiosError<any>).response?.data?.message, {
          duration: 4000,
          status: "error",
        });
      } else if ((error as AxiosError<any>).response?.data?.code === "R001") {
        Toast.show((error as AxiosError<any>).response?.data?.message, {
          duration: 4000,
          status: "error",
        });

        router.replace("/");
      } else {
        Toast.show("방에 입장할 수 없어요", {
          status: "error",
          duration: 10000,
        });
      }

      setTimeout(() => {
        Toast.show(
          "방에 입장하려면 친구에게 QR코드나 초대링크를 받아 입장하세요",
          {
            status: "info",
            duration: 10000,
          }
        );
      }, 1400);
    }
  }, [isError]);

  useEffect(() => {
    if (proposedPlaylist) {
      queryClient.invalidateQueries(queryKeys.pendingPlaylist(playlistId));
    }
  }, [proposedPlaylist]);

  const [centerIdx, setCenterIdx] = useState(INITIAL_SLIDE_INDEX);

  const isMobile = useIsMobile();

  return (
    <>
      <Spacer
        type="vertical"
        justify="space-between"
        style={{ height: "100%" }}
      >
        <Spacer type="vertical" gap={16}>
          <TopBar
            leftIconButton={<TopBarIconButton iconName="logo" boxSize={29} />}
            rightIconButton={
              roomData?.currentUser.role === "CREATOR" ? (
                <Modal
                  trigger={({ open }) => (
                    <TopBarIconButton iconName="setting" onClick={open} />
                  )}
                  modal={({ close }) => (
                    <RoomSettingScreen
                      onClickBackButton={close}
                      room={roomData}
                    />
                  )}
                />
              ) : (
                <></>
              )
            }
          />
          <Spacer type="vertical" gap={8} style={{ paddingLeft: 16 }}>
            {isLoadingRoomQuery ? (
              <>
                <Skeleton.Box height={36} width={160} />
                <Skeleton.Paragraph line={2} />
              </>
            ) : (
              <>
                <S.Title>
                  {roomData?.name}{" "}
                  {isHost && (
                    <S.Tag>
                      방장{" "}
                      <Image
                        src="/images/icon-crown.svg"
                        width={13}
                        height={13}
                        alt="icon-crown"
                      />
                    </S.Tag>
                  )}
                </S.Title>
                <S.Desc>
                  {roomData?.participantsCount !== undefined &&
                  roomData?.participantsCount > 1
                    ? `${roomData?.participantsCount}명이 함께 듣고 있어요`
                    : "함께 듣고 싶은 사람을 초대해보세요."}
                </S.Desc>
              </>
            )}
          </Spacer>
        </Spacer>
        {isLoadingRoomQuery ? (
          <div style={{ height: "40vh", margin: "0 16px" }}>
            <Skeleton.Box height={"40vh"} width={"100%"} />
          </div>
        ) : (
          <S.Slider
            className="center"
            infinite={false}
            arrows={false}
            speed={500}
            slidesToShow={1}
            initialSlide={INITIAL_SLIDE_INDEX}
            adaptiveHeight
            centerMode
            beforeChange={(curr, next) => {
              setCenterIdx(next);
            }}
            centerIdx={centerIdx}
            centerPadding="25%"
            isMobile={isMobile}
            // draggable
          >
            <QRCodeCard roomId={roomId} />
            <NowPlayingCard
              noPlaylist={!playlist.length}
              currentMusic={currentMusic}
              player={player}
            />

            <PlaylistCard currentMusic={currentMusic} />
          </S.Slider>
        )}

        <Spacer justify="center" gap={36} style={{ margin: "0 0 32px 0" }}>
          {isLoadingRoomQuery ? (
            <>
              <Skeleton.Circle size={72} />
              <Skeleton.Circle size={72} />
            </>
          ) : (
            <>
              {" "}
              <Actions.NewMusic
                isHost={isHost}
                value={
                  isHost && pendingData !== undefined ? pendingData?.length : 0
                }
              />
              <Actions.Emoji />
              <Actions.Chat />
            </>
          )}
        </Spacer>
      </Spacer>

      {isHost && currentMusic && (
        <S.YoutubeWrapper hidden>
          <YouTube
            id="iframe"
            videoId={currentMusic.videoId}
            opts={{
              width: 300,
              height: 200,
              playerVars: {
                autoplay: 1,
                controls: 1,
              },
            }}
            onPlay={() =>
              publishPlayerState({
                playlistId,
                playlistItemId: playerState.playingMusicId,
                playStatus: "PLAY",
              })
            }
            onPause={() =>
              publishPlayerState({
                playlistId,
                playlistItemId: playerState.playingMusicId,
                playStatus: "PAUSE",
              })
            }
            onReady={(event) => {
              setPlayer(event.target);
              setPlayerState((prev) => ({
                ...prev,
                playingMusicId: currentMusic.playlistItemId,
              }));
              event.target.playVideo();
            }}
            onEnd={() => {
              if (
                playerState.playingMusicId ===
                playlist[playlist.length - 1].playlistItemId
              ) {
                return alert("끝!!");
              }

              playNextMusic();
            }}
          />
        </S.YoutubeWrapper>
      )}
    </>
  );
};

const Actions = {
  NewMusic: ({
    isHost = false,
    value,
  }: {
    isHost?: boolean;
    value: number;
  }) => (
    <Spacer type="vertical" align="center" gap={8}>
      <Modal
        trigger={({ open }) => (
          <IconButton iconName="star" onClick={open} badgeValue={value} />
        )}
        modal={({ close }) => <AddSongScreen onClickBackButton={close} />}
      />
      <S.IconText>{isHost ? "곡추가" : "곡신청"}</S.IconText>
    </Spacer>
  ),
  Emoji,
  Chat: () => (
    <Spacer type="vertical" align="center" gap={8}>
      <IconButton
        iconName="icon-chat"
        onClick={() => Toast.show(<Spacer>준비중입니다</Spacer>)}
      />
      <S.IconText>채팅</S.IconText>
    </Spacer>
  ),
};

export default RoomPage;

const S = {
  Title: styled.h1`
    font-weight: 700;
    font-size: 28px;

    display: flex;
    align-items: center;
    gap: 8.5px;
  `,
  Desc: styled.h4`
    font-weight: 500;
    font-size: 14px;
    color: #6b6b6b;
  `,
  ContentWrapper: styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
    ::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  `,
  YoutubeWrapper: styled.div<{ hidden: boolean }>`
    visibility: ${(p) => p.hidden && "hidden"};
  `,
  IconText: styled.span`
    font-weight: 600;
    font-size: 14px;
    line-height: 155%;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: -0.498081px;
  `,

  Tag: styled.div`
    width: 67.56px;
    height: 30px;
    background: #252525;
    border-radius: 5px;

    font-weight: 500;
    font-size: 15px;
    line-height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    letter-spacing: -0.544648px;

    color: #ffffff;
  `,

  Slider: styled(Slider)<{ centerIdx: number; isMobile: boolean }>`
    width: 100%;

    .slick-list {
      overflow: visible;
    }

    .slick-track {
      height: 100%;
    }

    .slick-slide {
      position: relative;
      transition: all 300ms;
    }

    .slick-center {
      z-index: 999;
    }

    .slick-slide[data-index="${(p) => p.centerIdx - 1}"] {
      transform: rotate(10deg)
        translate(${(p) => (p.isMobile ? "-40%" : "-20%")}, -20px);
    }

    .slick-slide[data-index="${(p) => p.centerIdx}"] {
      transform: rotate(0);
      filter: drop-shadow(0 0 48px rgba(0, 0, 0, 0.5));
    }

    .slick-slide[data-index="${(p) => p.centerIdx + 1}"] {
      transform: rotate(-20deg)
        translate(${(p) => (p.isMobile ? "20%" : "5%")}, -20px);
      filter: drop-shadow(0 0 48px rgba(0, 0, 0, 0.5));
    }
  `,
};
