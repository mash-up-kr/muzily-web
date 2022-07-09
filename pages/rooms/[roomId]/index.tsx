import React, { useState } from "react";
import type { NextPage } from "next";
import styled from "@emotion/styled";
import YouTube from "react-youtube";
import { NowPlayingCard } from "~/components/domains";
import AddSongScreen from "~/components/domains/AddSongScreen";
import PlaylistCard from "~/components/domains/PlaylistCard";
import PlaylistScreen from "~/components/domains/PlaylistScreen";
import { Layout } from "~/components/uis";
import IconButton from "~/components/uis/IconButton";

const TITLE = "매쇼~쉬는탐";
const DESC = "곡을 추가하거나 좋아요를 해보세요!";

const VIDEO_LIST = [
  {
    id: "4q4vpQCIZ6w",
    artist: "유튜브",
    title: "재즈 플레이리스트1",
    thumbnail: "https://i.ytimg.com/vi/4q4vpQCIZ6w/hqdefault.jpg",
  },
  {
    id: "2HQag9B4nN0",
    artist: "유튜브",
    title: "재즈 플레이리스트2",
    thumbnail: "https://i.ytimg.com/vi/2HQag9B4nN0/hqdefault.jpg",
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

const RoomPage: NextPage = () => {
  const [openAddSongScreen, setOpenAddSongScreen] = useState(false);
  const [openPlaylistScreen, setOpenPlaylistScreen] = useState(false);

  const [player, setPlayer] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(0);

  console.log(openAddSongScreen);

  return (
    <Layout>
      <StyledContainer>
        <StyledHeader>
          <StyledTitle>{TITLE}</StyledTitle>
          <StyledDesc>{DESC}</StyledDesc>
        </StyledHeader>

        <StyledContentWrapper>
          <NowPlayingCard
            noPlaylist={!VIDEO_LIST.length}
            musicData={VIDEO_LIST[playingIndex]}
            player={player}
          />
          <NowPlayingCard noPlaylist musicData={VIDEO_LIST[playingIndex]} />
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
          videoList={VIDEO_LIST}
          playingIndex={playingIndex}
          setPlayingIndex={setPlayingIndex}
        />
      )}

      <YoutubeWrapper hidden>
        <YouTube
          id="iframe"
          videoId={VIDEO_LIST[playingIndex].id}
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
            if (playingIndex === VIDEO_LIST.length - 1) {
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

export default RoomPage;
