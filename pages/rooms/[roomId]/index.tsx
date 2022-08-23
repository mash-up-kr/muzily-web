import React, { useEffect, useMemo, useRef, useState } from "react";
import type { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import YouTube from "react-youtube";
import { useRecoilState, useRecoilValue } from "recoil";
import { NEW_VIDEO_LIST } from "~/assets/dummy";
import {
  NowPlayingCard,
  PlaylistCard,
  AddSongScreen,
  MoodScreen,
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

const RoomContentPage: NextPage<Props> = ({ isHost: host }) => {
  const router = useRouter();
  const { roomId } = router.query as { roomId: string };

  const { data: roomData, isError } = useRoomQuery(Number(roomId));

  const {
    state: { isHost, proposedMusicList },
    actions,
  } = useRoomStore();

  const [player, setPlayer] = useState(null);
  const [playerState, setPlayerState] = useRecoilState(playerAtomState);
  const [playlist] = useRecoilState(playlistAtomState);
  const playlistId = useRecoilValue(playlistIdAtomState);
  const contentRef = useRef<HTMLDivElement>(null);

  const { playNextMusic } = usePlayerActions();

  const { publish: publishPlayerState } = useUpdatePlayerState(+roomId);

  const currentMusic = useMemo(
    () =>
      playlist.find((item) => item.id === playerState.playingMusicId) ||
      playlist[0],
    [playerState.playingMusicId, playlist]
  );

  useEffect(() => {
    actions.init(host ? [] : NEW_VIDEO_LIST, host, "");
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      const contentWidth = contentRef.current.offsetWidth;
      contentRef.current.scrollTo({
        left: contentWidth / 2 - contentWidth / 4,
      });
    }
  }, [contentRef]);

  useEffect(() => {
    if (isError) {
      router.replace("/");
    }
  }, [isError]);

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
          <QRCodeCard roomId={roomId} />
          <NowPlayingCard
            noPlaylist={!playlist.length}
            currentMusic={currentMusic}
            player={player}
          />

          <PlaylistCard currentMusic={currentMusic} />
        </S.ContentWrapper>

        <Spacer justify="center" gap={36} style={{ margin: "0 0 32px 0" }}>
          <Actions.NewMusic value={isHost ? proposedMusicList.length : 0} />
          <Actions.Emoji />
          {/* XXX: User test를 위한 임시값 */}
          <Actions.ChangeMood value={isHost ? 2 : 0} />
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
                playingMusicId: currentMusic.id,
              }));
              event.target.playVideo();
            }}
            onEnd={() => {
              if (
                playerState.playingMusicId === playlist[playlist.length - 1].id
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
  ChangeMood: ({ value }: { value: number }) => {
    return (
      <Spacer type="vertical" align="center" gap={8}>
        <Modal
          trigger={({ open }) => (
            <IconButton iconName="union" onClick={open} badgeValue={value} />
          )}
          modal={({ close }) => <MoodScreen onClickBackButton={close} />}
        />
        <S.IconText>무드변경</S.IconText>
      </Spacer>
    );
  },
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
};
