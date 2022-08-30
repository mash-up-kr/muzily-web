import React, { useEffect, useMemo, useState } from "react";
import type { NextPage, NextPageContext } from "next";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
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
} from "~/components/uis";
import { queryKeys } from "~/consts/react-query";
import RoomSocketProvider from "~/contexts/RoomSocket";
import { useGetPlaylistPendingItems } from "~/hooks/api";
import { useRoomQuery } from "~/hooks/api/rooms";
import usePlayerActions from "~/hooks/domains/usePlayerActions";
import { useUpdatePlayerState } from "~/hooks/webSocket";
import { useRoomStore } from "~/store";
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
      router.replace("/");
    }
  }, [isError]);

  useEffect(() => {
    if (proposedPlaylist) {
      queryClient.invalidateQueries(queryKeys.pendingPlaylist(playlistId));
    }
  }, [proposedPlaylist]);

  const [centerIdx, setCenterIdx] = useState(INITIAL_SLIDE_INDEX);

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
                <S.Title>{roomData?.name}</S.Title>
                <S.Desc>곡을 추가하거나 좋아요를 해보세요!</S.Desc>
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
            infinite
            speed={500}
            slidesToShow={1}
            initialSlide={INITIAL_SLIDE_INDEX}
            adaptiveHeight
            centerMode
            beforeChange={(curr, next) => {
              setCenterIdx(next);
            }}
            centerIdx={centerIdx}
            centerPadding="32px"
            draggable
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
};

export default RoomPage;

const S = {
  Title: styled.h1`
    font-weight: 700;
    font-size: 28px;
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
  Slider: styled(Slider)<{ centerIdx: number }>`
    width: 100%;
    margin-top: 10%;
    .slick-list {
      overflow: visible;
    }

    .slick-track {
      height: 100%;
    }

    .slick-slide {
      transition: all 300ms;
      z-index: 0;
    }
    .slick-slide[data-index="${(p) => p.centerIdx - 1}"] {
      transform: rotate(5deg);
    }

    .slick-slide[data-index="${(p) => p.centerIdx}"] {
      transform: rotate(0);
      filter: drop-shadow(0 0 48px rgba(0, 0, 0, 0.5));
    }

    .slick-slide[data-index="${(p) => p.centerIdx + 1}"] {
      transform: rotate(-5deg);
      filter: drop-shadow(0 0 48px rgba(0, 0, 0, 0.5));
    }
  `,
};
