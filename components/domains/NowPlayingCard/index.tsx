import React from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import type { Music } from "~/types/musics";
import Thumbnail from "../Thumbnail";

interface NowPlayingCardProps {
  noPlaylist?: boolean;
  musicData: Music;
  player?: any;
  onClickNext: () => void;
  onClickPrev: () => void;
}

function NowPlayingCard({
  noPlaylist = false,
  musicData,
  player,
  onClickNext,
  onClickPrev,
}: NowPlayingCardProps) {
  // 재생 중인 노래 없는경우
  if (noPlaylist) {
    return (
      <StyledContainer noPlaylist>
        <Title>Now Playing</Title>
        <Content>
          <NoPlaylistText>{`재생 중인\n노래가 없어요`}</NoPlaylistText>

          <Image
            src="/images/no-music-emoji.svg"
            alt="no-music"
            width={160}
            height={160}
          />

          <SubText>지금 바로 추가해보세요</SubText>
        </Content>
      </StyledContainer>
    );
  }
  // 재생 중인 노래 있는경우
  const musicText = `${musicData.artist} - ${musicData.title}`;

  return (
    <StyledContainer>
      <Title>Now Playing</Title>
      {/* <Content> */}
      <Thumbnail src={musicData.thumbnail} colors={musicData.colors} />
      {/* </Content> */}

      <Controller>
        <Image
          src="/images/play-back.svg"
          alt="play-back"
          width={20}
          height={20}
          onClick={onClickPrev}
        />
        <Image
          src="/images/pause-button.svg"
          alt="play-back"
          width={60}
          height={60}
          onClick={() => player.pauseVideo()}
        />
        <Image
          src="/images/play-next.svg"
          alt="play-next"
          width={20}
          height={20}
          onClick={onClickNext}
        />
      </Controller>

      <StyledMusicText>{musicText}</StyledMusicText>
    </StyledContainer>
  );
}

const StyledContainer = styled.div<{ noPlaylist?: boolean }>`
  cursor: pointer;
  position: relative;
  width: 220px;
  height: 314px;

  background: ${(p) => (p.noPlaylist ? "#007aff" : "#fff")};
  border-radius: 20px;
  padding: 20px;

  flex-shrink: 0;
`;

const Title = styled.h3`
  margin: 0;
  font-weight: 800;
  font-size: 14px;
  line-height: 17px;
  color: #fff;

  position: absolute;
  top: 20px;
  z-index: 1;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`;

const NoPlaylistText = styled.div`
  text-align: center;
  white-space: pre-wrap;
`;

const SubText = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: -0.04em;
  color: rgba(255, 255, 255, 0.65);
`;

const Controller = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
`;

const StyledMusicText = styled.div`
  color: #fff;
  z-index: 1;
  position: absolute;
  font-weight: 600;
  font-size: 17px;
  line-height: 145%;
  letter-spacing: -0.544648px;

  /* white-space: nowrap; */
  left: 0;
  bottom: 0;

  width: 100%;
  /* max-height: 75px; */

  padding: 0 20px;
  bottom: 30px;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default NowPlayingCard;
