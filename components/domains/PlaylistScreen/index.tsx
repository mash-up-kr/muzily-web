import React from "react";
import styled from "@emotion/styled";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TopBar, TopBarIconButton } from "~/components/uis";
import type { Music } from "~/types/musics";
import MusicItemCard from "./MusicItemCard";

interface PlaylistScreenProps {
  onClickBackButton: () => void;
  playList: Music[];
  playingMusicId: string;
  setPlayingMusicId: React.Dispatch<React.SetStateAction<string>>;
  setPlayList: React.Dispatch<React.SetStateAction<Music[]>>;
}

function PlaylistScreen({
  onClickBackButton,
  playList,
  playingMusicId,
  setPlayingMusicId,
  setPlayList,
}: PlaylistScreenProps) {
  const moveCard = (from: number, to: number) => {
    const arr = [...playList];
    const item = arr.splice(from, 1);
    const newArr = [...arr.slice(0, to), item[0], ...arr.slice(to)];
    setPlayList(newArr);
  };

  return (
    <StyledContainer>
      <TopBar
        leftIconButton={
          <TopBarIconButton iconName="arrow-left" onClick={onClickBackButton} />
        }
      >
        Playlist
      </TopBar>

      <DndProvider backend={HTML5Backend}>
        <MusicList>
          {playList.map((el, i) => (
            <MusicItemCard
              item={el}
              key={el.id}
              active={el.id === playingMusicId}
              index={i}
              onClick={() => setPlayingMusicId(el.id)}
              moveCard={moveCard}
            />
          ))}
        </MusicList>
      </DndProvider>
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
  z-index: 10;
`;

const MusicList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
`;

export default PlaylistScreen;
