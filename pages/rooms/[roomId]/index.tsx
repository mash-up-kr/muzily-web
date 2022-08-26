import React, { useEffect, useMemo, useRef, useState } from "react";
import type { NextPage, NextPageContext } from "next";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
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
import {
  Modal,
  Spacer,
  IconButton,
  TopBar,
  TopBarIconButton,
} from "~/components/uis";
import RoomSocketProvider from "~/contexts/RoomSocket";
import { useGetPlaylistPendingItems } from "~/hooks/api";
import { useRoomQuery } from "~/hooks/api/rooms";
import usePlayerActions from "~/hooks/domains/usePlayerActions";
import { useUpdatePlayerState } from "~/hooks/webSocket";
import { useRoomStore } from "~/store";
import { playlistAtomState } from "~/store/playlist";
import { playerAtomState, playlistIdAtomState } from "~/store/room";

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

const sliderSettings = {
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  initialSlide: INITIAL_SLIDE_INDEX,
  adaptiveHeight: true,

  centerPadding: "20%",
  centerMode: true,
  arrows: false,
};

const RoomContentPage: NextPage<Props> = ({ isHost: host }) => {
  const router = useRouter();
  const { roomId } = router.query as { roomId: string };

  const { data: roomData, isError } = useRoomQuery(Number(roomId));

  const {
    state: { isHost },
    actions,
  } = useRoomStore();

  const [player, setPlayer] = useState(null);
  const [playerState, setPlayerState] = useRecoilState(playerAtomState);
  const [playlist] = useRecoilState(playlistAtomState);
  const playlistId = useRecoilValue(playlistIdAtomState);
  const { data: pendingData } = useGetPlaylistPendingItems(playlistId, isHost);
  const contentRef = useRef<HTMLDivElement>(null);

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
    actions.init(host ? [] : [], host, "HEART");
  }, []);

  useEffect(() => {
    if (isError) {
      router.replace("/");
    }
  }, [isError]);

  const [centerIdx, setCenterIdx] = useState(INITIAL_SLIDE_INDEX);

  return (
    <>
      <Spacer
        type="vertical"
        justify="space-between"
        style={{ height: "100%" }}
      >
        <TopBar
          leftIconButton={<TopBarIconButton iconName="star" />}
          rightIconButton={
            roomData?.currentUser.role === "CREATOR" ? (
              <TopBarIconButton
                iconName="setting"
                onClick={() => {
                  router.push(`/rooms/${roomId}/setting`);
                }}
              />
            ) : (
              <></>
            )
          }
        />
        <S.Header>
          <S.Title>{roomData?.name}</S.Title>
          <S.Desc>곡을 추가하거나 좋아요를 해보세요!</S.Desc>
        </S.Header>

        <S.ContentWrapper ref={contentRef}>
          <S.Slider
            {...sliderSettings}
            beforeChange={(curr, next) => {
              setCenterIdx(next);
            }}
            centerIdx={centerIdx}
          >
            <QRCodeCard roomId={roomId} />
            <NowPlayingCard
              noPlaylist={!playlist.length}
              currentMusic={currentMusic}
              player={player}
            />

            <PlaylistCard currentMusic={currentMusic} />
          </S.Slider>
        </S.ContentWrapper>

        <Spacer justify="center" gap={36} style={{ margin: "0 0 32px 0" }}>
          <Actions.NewMusic
            value={
              isHost && pendingData !== undefined ? pendingData?.length : 0
            }
          />
          <Actions.Emoji />
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
  NewMusic: ({ value }: { value: number }) => (
    <Spacer type="vertical" align="center" gap={8}>
      <Modal
        trigger={({ open }) => (
          <IconButton iconName="star" onClick={open} badgeValue={value} />
        )}
        modal={({ close }) => <AddSongScreen onClickBackButton={close} />}
      />
      <S.IconText>곡추가</S.IconText>
    </Spacer>
  ),
  Emoji,
};

export default RoomPage;

const S = {
  Header: styled.div`
    margin: 8px 0 0 16px;
  `,
  Title: styled.h1`
    font-weight: 700;
    font-size: 28px;
    line-height: 155%;
  `,
  Desc: styled.h4`
    font-weight: 500;
    font-size: 14px;
    line-height: 145%;
    letter-spacing: -0.02em;
    color: #6b6b6b;
  `,
  ContentWrapper: styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    gap: 20px;
    overflow-x: auto;
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

    .slick-list {
    }

    .slick-slide {
      transition: all 300ms;
      z-index: 0;
    }
    .slick-slide[data-index="${(p) => p.centerIdx - 1}"] {
      transform: rotate(10deg);
      z-index: 999;
    }

    .slick-slide[data-index="${(p) => p.centerIdx}"] {
      transform: rotate(0);
    }

    .slick-slide[data-index="${(p) => p.centerIdx + 1}"] {
      transform: rotate(-20deg);
    }
  `,
};
