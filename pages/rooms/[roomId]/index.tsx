import React, { useState } from "react";
import type { NextPage, NextPageContext } from "next";
import styled from "@emotion/styled";
import Vibrant from "node-vibrant";
import YouTube from "react-youtube";
import { NowPlayingCard } from "~/components/domains";
import AddSongScreen from "~/components/domains/AddSongScreen";
import PlaylistCard from "~/components/domains/PlaylistCard";
import PlaylistScreen from "~/components/domains/PlaylistScreen";
import { Layout } from "~/components/uis";
import IconButton from "~/components/uis/IconButton";
import type { Music } from "~/types/musics";

const TITLE = "매쇼~쉬는탐";
const DESC = "곡을 추가하거나 좋아요를 해보세요!";

const MUSIC_LIST = [
  {
    id: "DYrY1E4-9NI",
    artist: "BIG Naughty",
    title: "Beyond Love (Feat. 10CM)",
    thumbnail: "https://i.ytimg.com/vi/DYrY1E4-9NI/hqdefault.jpg",
  },
  {
    id: "f6YDKF0LVWw",
    artist: "NAYEON",
    title: "POP!",
    thumbnail: "https://i.ytimg.com/vi/f6YDKF0LVWw/hqdefault.jpg",
  },
  {
    id: "l-jZOXa7gQY",
    artist: "IVE",
    title: "LOVE DIVE",
    thumbnail: "https://i.ytimg.com/vi/l-jZOXa7gQY/hqdefault.jpg",
  },
  {
    id: "D1PvIWdJ8xo",
    artist: "아이유",
    title: "Blueming",
    thumbnail: "https://i.ytimg.com/vi/D1PvIWdJ8xo/hqdefault.jpg",
  },
  {
    id: "d9IxdwEFk1c",
    artist: "아이유",
    title: "Palette",
    thumbnail: "https://i.ytimg.com/vi/d9IxdwEFk1c/hqdefault.jpg",
  },
  {
    id: "Jh4QFaPmdss",
    artist: "여자아이들",
    title: "Tomboy",
    thumbnail: "https://i.ytimg.com/vi/Jh4QFaPmdss/hqdefault.jpg",
  },
];

interface RoomPageProps {
  data: Music[];
}

const RoomPage: NextPage<RoomPageProps> = (props) => {
  const [openAddSongScreen, setOpenAddSongScreen] = useState(false);
  const [openPlaylistScreen, setOpenPlaylistScreen] = useState(false);

  const [player, setPlayer] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(0);

  const handleClickPlayNext = () => {
    if (playingIndex === props.data.length - 1) {
      return alert("마지막곡 입니다");
    }

    setPlayingIndex((prev) => prev + 1);
  };

  const handleClickPlayBack = () => {
    if (playingIndex === 0) {
      return alert("처음 곡입니다");
    }
    setPlayingIndex((prev) => prev - 1);
  };

  return (
    <Layout>
      <StyledContainer>
        <StyledHeader>
          <StyledTitle>{TITLE}</StyledTitle>
          <StyledDesc>{DESC}</StyledDesc>
        </StyledHeader>

        <StyledContentWrapper>
          <NowPlayingCard
            noPlaylist={!props.data.length}
            musicData={props.data[playingIndex]}
            player={player}
            onClickNext={handleClickPlayNext}
            onClickPrev={handleClickPlayBack}
          />
          <PlaylistCard onClick={() => setOpenPlaylistScreen(true)} />
        </StyledContentWrapper>

        <StyledIconWrapper>
          <IconButton
            iconName="star"
            iconText="곡 추가"
            onClick={() => setOpenAddSongScreen((prev) => !prev)}
          />
          <IconButton iconName="heart" iconText="이모지" />
          <IconButton iconName="union" iconText="무드 변경" />
        </StyledIconWrapper>
      </StyledContainer>

      {openAddSongScreen && (
        <AddSongScreen onClickBackButton={() => setOpenAddSongScreen(false)} />
      )}

      {openPlaylistScreen && (
        <PlaylistScreen
          onClickBackButton={() => setOpenPlaylistScreen(false)}
          videoList={MUSIC_LIST}
          playingIndex={playingIndex}
          setPlayingIndex={setPlayingIndex}
        />
      )}

      <YoutubeWrapper hidden>
        <YouTube
          id="iframe"
          videoId={MUSIC_LIST[playingIndex].id}
          opts={{
            width: 300,
            height: 200,
            playerVars: {
              autoplay: 1,
              controls: 1,
            },
          }}
          onReady={(event) => {
            setPlayer(event.target);
            event.target.playVideo();
          }}
          onEnd={() => {
            if (playingIndex === MUSIC_LIST.length - 1) {
              return alert("끝!!");
            }

            setPlayingIndex((prev) => prev + 1);
          }}
        />
      </YoutubeWrapper>
    </Layout>
  );
};

const StyledContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 0;
`;

const StyledHeader = styled.div``;

const StyledTitle = styled.h1`
  font-weight: 700;
  font-size: 28px;
  line-height: 155%;
  margin: 10px 0 0;
`;

const StyledDesc = styled.h4`
  font-weight: 500;
  font-size: 14px;
  line-height: 145%;
  letter-spacing: -0.02em;
  color: #6b6b6b;
  margin: 8px 0 0;
  margin-bottom: 34px;
`;

const StyledIconWrapper = styled.div`
  display: flex;
  gap: 36px;
  margin-top: 22px;
  justify-content: center;
`;

const StyledContentWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 20px;
  overflow-x: auto;
`;

const YoutubeWrapper = styled.div<{ hidden: boolean }>`
  visibility: ${(p) => p.hidden && "hidden"};
`;

RoomPage.getInitialProps = async (ctx: NextPageContext) => {
  const list = [...MUSIC_LIST];

  const data: RoomPageProps["data"] = await Promise.all(
    list.map(async (el) => {
      const palette = await Vibrant.from(el.thumbnail).getPalette();
      const colors = Object.values(palette).map((swatches) => swatches?.hex);

      return {
        ...el,
        colors,
      };
    })
  );

  return {
    data,
  };
};

export default RoomPage;
