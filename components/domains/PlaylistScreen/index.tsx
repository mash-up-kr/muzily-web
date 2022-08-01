import React from "react";
import styled from "@emotion/styled";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
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
    <S.Container>
      <TopBar
        leftIconButton={
          <TopBarIconButton iconName="arrow-left" onClick={onClickBackButton} />
        }
      >
        Playlist
      </TopBar>

      <DndProvider
        backend={TouchBackend}
        options={{
          enableMouseEvents: true,
        }}
      >
        <S.MusicList>
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
        </S.MusicList>
      </DndProvider>
    </S.Container>
  );
}

const S = {
  Container: styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-color: #030303;
    padding: 0 20px;
    z-index: 10;
  `,
  MusicList: styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 20px;
  `,
};

export default PlaylistScreen;
