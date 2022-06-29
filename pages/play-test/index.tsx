import React, { useState } from "react";
import styled from "@emotion/styled";
import type { YouTubePlayer } from "react-youtube";
import YouTube from "react-youtube";

const VIDEO_LIST = [
  {
    id: "4q4vpQCIZ6w",
    artist: "유튜브",
    title: "재즈 플레이리스트1",
  },
  {
    id: "2HQag9B4nN0",
    artist: "유튜브",
    title: "재즈 플레이리스트2",
  },
  {
    id: "D1PvIWdJ8xo",
    artist: "아이유",
    title: "Blueming",
  },
  {
    id: "d9IxdwEFk1c",
    artist: "아이유",
    title: "Palette",
  },
  {
    id: "Jh4QFaPmdss",
    artist: "여자아이들",
    title: "Tomboy",
  },
];

function YouTubeComponentExample() {
  const [player, setPlayer] = useState<YouTubePlayer>(null);
  const [videoId, setVideoId] = useState(VIDEO_LIST[0].id);
  const [hidden, setHidden] = useState(false);

  /* TODO @(Young-mason) 인덱스 캐싱하기 */
  const handleChangeNext = () => {
    const currentIndex = findVideoIndex(videoId);
    if (currentIndex === VIDEO_LIST.length - 1) {
      return alert("끝입니다");
    }
    setVideoId(VIDEO_LIST[currentIndex + 1].id);
  };

  const handleChangePrev = () => {
    const currentIndex = findVideoIndex(videoId);
    if (currentIndex === 0) {
      return alert("처음입니다");
    }
    setVideoId(VIDEO_LIST[currentIndex - 1].id);
  };

  return (
    <Container>
      <div style={{ display: "flex", marginBottom: "1em" }}>
        <button type="button" onClick={() => player?.seekTo(120, true)}>
          2분 0초 이동
        </button>

        <button id="play" type="button" onClick={() => player?.playVideo()}>
          재생
        </button>
        <button type="button" onClick={() => player?.pauseVideo()}>
          정지
        </button>
        <button type="button" onClick={handleChangeNext}>
          다음
        </button>
        <button type="button" onClick={handleChangePrev}>
          이전
        </button>
        <button type="button" onClick={() => setHidden((prev) => !prev)}>
          {hidden ? "보이기" : "숨기기"}
        </button>
      </div>

      <YoutubeWrapper hidden={hidden}>
        <YouTube
          id="iframe"
          videoId={videoId}
          opts={{
            width: 300,
            height: 200,
            playerVars: {
              autoplay: 1,
              controls: 1,
            },
          }}
          onReady={(event) => setPlayer(event.target)}
          onEnd={() => {
            const currentIndex = findVideoIndex(videoId);

            if (currentIndex === VIDEO_LIST.length - 1) {
              return alert("끝!!");
            }

            setVideoId(VIDEO_LIST[currentIndex + 1].id);
          }}
        />
      </YoutubeWrapper>

      <MusicList>
        {VIDEO_LIST.map((el) => (
          <MusicItem key={el.id}>
            <Artist>{el.artist}</Artist>
            <Title>{el.title}</Title>
            <button
              onClick={() => {
                setVideoId(el.id);
              }}
            >
              재생하기
            </button>
            <div>{el.id === videoId && "재생중"}</div>
          </MusicItem>
        ))}
      </MusicList>
    </Container>
  );
}

export default YouTubeComponentExample;

function findVideoIndex(id: string) {
  return VIDEO_LIST.findIndex((el) => el.id === id);
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const YoutubeWrapper = styled.div<{ hidden: boolean }>`
  visibility: ${(p) => p.hidden && "hidden"};
`;

const MusicList = styled.div``;

const MusicItem = styled.div`
  display: flex;
  padding: 15px;
  gap: 16px;
`;

const Title = styled.div``;

const Artist = styled.div``;
