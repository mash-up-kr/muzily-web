import React, { useEffect, useMemo, useState } from "react";
import type { NextPage, NextPageContext } from "next";
import styled from "@emotion/styled";
import Vibrant from "node-vibrant";
import YouTube from "react-youtube";
import { VIDEO_LIST } from "~/assets/dummy";
import { NowPlayingCard } from "~/components/domains";
import AddSongScreen from "~/components/domains/AddSongScreen";
import PlaylistCard from "~/components/domains/PlaylistCard";
import PlaylistScreen from "~/components/domains/PlaylistScreen";
import { Layout } from "~/components/uis";
import IconButton from "~/components/uis/IconButton";
import { useRoomStore } from "~/store";
import type { Music } from "~/types/musics";

const TITLE = "매쇼~쉬는탐";
const DESC = "곡을 추가하거나 좋아요를 해보세요!";
interface RoomPageProps {
  musicData: Music[];
}

const RoomPage: NextPage<RoomPageProps> = ({ musicData }) => {
  const {
    state: { playingMusicId, playList, openAddSongScreen, openPlaylistScreen },
    actions,
  } = useRoomStore();

  const [player, setPlayer] = useState(null);

  const currentMusic = useMemo(
    () => playList.find((item) => item.id === playingMusicId) || playList[0],
    [playingMusicId, playList]
  );

  useEffect(() => {
    actions.init(musicData);
  }, []);

  return (
    <Layout>
      <S.Container>
        <S.Header>
          <S.Title>{TITLE}</S.Title>
          <S.Desc>{DESC}</S.Desc>
        </S.Header>

        <S.ContentWrapper>
          <NowPlayingCard
            noPlaylist={!playList.length}
            currentMusic={currentMusic}
            player={player}
          />
          <PlaylistCard currentMusic={currentMusic} />
        </S.ContentWrapper>

        <S.IconWrapper>
          <IconButton
            iconName="star"
            iconText="곡 추가"
            onClick={() => actions.setOpenAddSongScreen(!openAddSongScreen)}
          />
          <IconButton iconName="heart" iconText="이모지" />
          <IconButton iconName="union" iconText="무드 변경" />
        </S.IconWrapper>
      </S.Container>

      {openAddSongScreen && (
        <AddSongScreen
          onClickBackButton={() => actions.setOpenAddSongScreen(false)}
        />
      )}

      {openPlaylistScreen && <PlaylistScreen />}

      {currentMusic && (
        <S.YoutubeWrapper hidden>
          <YouTube
            id="iframe"
            videoId={currentMusic.id}
            opts={{
              width: 300,
              height: 200,
              playerVars: {
                autoplay: 1,
                controls: 1,
              },
            }}
            onPlay={() => actions.setIsPlaying(true)}
            onPause={() => actions.setIsPlaying(false)}
            onReady={(event) => {
              setPlayer(event.target);
              event.target.playVideo();
            }}
            onEnd={() => {
              if (playingMusicId === playList[playList.length - 1].id) {
                return alert("끝!!");
              }

              actions.playNextMusic();
            }}
          />
        </S.YoutubeWrapper>
      )}
    </Layout>
  );
};

const S = {
  Container: styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 0;
  `,
  Header: styled.div``,
  Title: styled.h1`
    font-weight: 700;
    font-size: 28px;
    line-height: 155%;
    margin: 10px 0 0;
  `,
  Desc: styled.h4`
    font-weight: 500;
    font-size: 14px;
    line-height: 145%;
    letter-spacing: -0.02em;
    color: #6b6b6b;
    margin: 8px 0 0;
    margin-bottom: 34px;
  `,
  IconWrapper: styled.div`
    display: flex;
    gap: 36px;
    margin-top: 22px;
    justify-content: center;
  `,
  ContentWrapper: styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 20px;
    overflow-x: auto;
  `,
  YoutubeWrapper: styled.div<{ hidden: boolean }>`
    visibility: ${(p) => p.hidden && "hidden"};
  `,
};

RoomPage.getInitialProps = async (ctx: NextPageContext) => {
  const list = [...VIDEO_LIST];
  const musicData: Music[] = await Promise.all(
    list.map(async (el) => {
      try {
        const palette = await Vibrant.from(el.thumbnail).getPalette();
        const colors = Object.values(palette).map(
          (swatches) => swatches?.hex || ""
        );

        return {
          ...el,
          colors,
        };
      } catch (error) {
        console.error(error);

        return el;
      }
    })
  );

  return {
    musicData,
  };
};

export default RoomPage;
