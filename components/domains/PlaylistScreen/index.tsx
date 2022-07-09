import React from "react";
import styled from "@emotion/styled";
import { TopBar, TopBarIconButton } from "~/components/uis";

interface PlaylistScreenProps {
  onClickBackButton: () => void;
  videoList: any[];
  playingIndex: number;
}

function PlaylistScreen({
  onClickBackButton,
  videoList,
  playingIndex,
}: PlaylistScreenProps) {
  return (
    <StyledContainer>
      <TopBar
        leftIconButton={
          <TopBarIconButton iconName="arrow-left" onClick={onClickBackButton} />
        }
      >
        Playlist
      </TopBar>

      <MusicList>
        {videoList.map((el, i) => (
          <MusicItem key={el.id} active={i === playingIndex}>
            <Title>{el.title}</Title>
            <Artist active={i === playingIndex}>{el.artist}</Artist>
            {/* {i === playingIndex && "재생중"} */}
          </MusicItem>
        ))}
      </MusicList>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background-color: #030303;
  padding: 0 20px;
`;

const MusicList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
`;

const MusicItem = styled.div<{ active: boolean }>`
  cursor: pointer;
  padding: 16px 18px;
  gap: 16px;
  border-radius: 7px;
  height: 70px;
  /* display: flex; */
  background-color: ${(p) => (p.active ? "#fff" : "#007aff")};
  color: ${(p) => (p.active ? "#007aff" : "#fff")};
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 155%;
`;

const Artist = styled.div<{ active: boolean }>`
  font-weight: 400;
  font-size: 12px;
  line-height: 155%;

  display: flex;
  align-items: center;
  letter-spacing: -0.420386px;

  color: ${(p) =>
    p.active ? "rgba(74, 74, 74, 0.74)" : "rgba(255, 255, 255, 0.54)"};
`;

export default PlaylistScreen;
