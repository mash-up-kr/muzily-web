import React from "react";
import styled from "@emotion/styled";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { TopBar, TopBarIconButton } from "~/components/uis";
import { useModal } from "~/components/uis/Modal";
import { useRoomStore } from "~/store";
import MusicItemCard from "./MusicItemCard";

function PlaylistModal() {
  const {
    state: { playList, playingMusicId, isHost },
    actions,
  } = useRoomStore();
  const { close } = useModal();

  const moveCard = (from: number, to: number) => {
    if (!isHost) {
      return null;
    }
    const arr = [...playList];
    const item = arr.splice(from, 1);
    const newArr = [...arr.slice(0, to), item[0], ...arr.slice(to)];
    actions.setPlaylist(newArr);
  };

  return (
    <S.Container>
      <TopBar
        sticky
        leftIconButton={
          <TopBarIconButton iconName="arrow-left" onClick={close} />
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
              onClick={() => {
                if (isHost) {
                  actions.setPlayingMusicId(el.id);
                }
              }}
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
    overflow: auto;
  `,
  MusicList: styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 20px;
  `,
};

export default PlaylistModal;
