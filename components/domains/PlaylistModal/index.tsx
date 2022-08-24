import React, { useState } from "react";
import styled from "@emotion/styled";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { useRecoilState, useRecoilValue } from "recoil";
import { Layout, TopBar, TopBarIconButton } from "~/components/uis";
import { useModal } from "~/components/uis/Modal";
import {
  useChangePlaylistOrder,
  useRemovePlaylistItem,
} from "~/hooks/webSocket";
import { useRoomStore } from "~/store";
import { playlistAtomState, removeListAtomState } from "~/store/playlist";
import {
  playerAtomState,
  playlistIdAtomState,
  roomIdAtomState,
} from "~/store/room";
import MusicItemCard from "./MusicItemCard";

function PlaylistModal() {
  const {
    state: { isHost },
    actions,
  } = useRoomStore();
  const { close } = useModal();

  const [playerState, setPlayerState] = useRecoilState(playerAtomState);
  const [playlist, setPlaylist] = useRecoilState(playlistAtomState);

  const roomId = useRecoilValue(roomIdAtomState);
  const playlistId = useRecoilValue(playlistIdAtomState);

  const [deleteMode, setDeleteMode] = useState(false);
  const [removeList, setRemoveList] = useRecoilState(removeListAtomState);

  const { publish: publishRemovePlaylistItemRequest } = useRemovePlaylistItem(
    roomId,
    {
      playlistId: -1,
      playlistItemIds: [],
    }
  );

  const { publish: changePlaylistOrder } = useChangePlaylistOrder(roomId, {
    playlistId: -1,
    prevPlaylistItemIdToMove: -1,
    playlistItemId: -1,
  });

  const moveCard = (fromIndex: number, toIndex: number) => {
    changePlaylistOrder({
      playlistId,
      prevPlaylistItemIdToMove: playlist[toIndex].id,
      playlistItemId: playlist[fromIndex].id,
    });
  };

  const handleClickDeleteButton = () => {
    publishRemovePlaylistItemRequest({
      playlistId,
      playlistItemIds: removeList,
    });
  };

  return (
    <Layout screenColor="rgba(0, 0, 0, 0.85)">
      <TopBar
        leftIconButton={
          <TopBarIconButton iconName="arrow-left" onClick={close} />
        }
        rightIconButton={
          isHost ? (
            deleteMode ? (
              <S.CancelText onClick={() => setDeleteMode(false)}>
                취소
              </S.CancelText>
            ) : (
              <TopBarIconButton
                iconName="bin"
                onClick={() => setDeleteMode(true)}
              />
            )
          ) : (
            <></>
          )
        }
      >
        {deleteMode ? "삭제할 음악을 선택해주세요" : "Playlist"}
      </TopBar>

      <DndProvider
        backend={HTML5Backend}
        // options={{
        //   enableMouseEvents: true,
        // }}
      >
        <S.MusicList>
          {playlist.map((el, i) => (
            <MusicItemCard
              item={el}
              key={el.videoId}
              active={el.id === playerState.playingMusicId}
              deleteMode={deleteMode}
              index={i}
              onClick={() => {
                if (isHost) {
                  setPlayerState((prev) => ({
                    ...prev,
                    playingMusicId: el.id,
                  }));
                }
              }}
              moveCard={moveCard}
            />
          ))}
        </S.MusicList>
      </DndProvider>

      {removeList.length ? (
        <S.DeleteButton onClick={handleClickDeleteButton}>
          {`${removeList.length}`.padStart(2, "0")} 삭제하기
        </S.DeleteButton>
      ) : (
        <></>
      )}
    </Layout>
  );
}

const S = {
  MusicList: styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 20px;
    padding: 0 16px;
  `,
  DeleteButton: styled.button`
    cursor: pointer;
    display: flex;
    align-items: center;
    text-align: center;

    padding: 14px 30px;
    background: #ffffff;
    box-shadow: 2.77208px 2.77208px 11.7813px rgba(0, 0, 0, 0.1);
    border-radius: 46px;

    font-weight: 600;
    font-size: 18px;
    line-height: 21px;
    letter-spacing: -0.450631px;
    color: #007aff;

    position: fixed;
    bottom: 18px;
    left: 50%;
    transform: translateX(-50%);
  `,
  CancelText: styled.span`
    cursor: pointer;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;

    letter-spacing: -0.739165px;

    color: #7c7c7c;
  `,
};

export default PlaylistModal;
