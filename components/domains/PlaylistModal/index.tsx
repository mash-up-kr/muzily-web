import type { ComponentPropsWithoutRef } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { useRecoilState, useRecoilValue } from "recoil";
import { Layout, Modal, TopBar, TopBarIconButton } from "~/components/uis";
import { useIsViewedPlaylistItemIds } from "~/hooks/domains";
import { useRemovePlaylistItem } from "~/hooks/webSocket";
import { playlistAtomState } from "~/store/playlist";
import { isHostAtomState, playlistIdAtomState } from "~/store/room";
import { PlaylistContext, usePlaylistContext } from "./context";
import Playlist from "./Playlist";

const PlaylistModal = ({
  trigger,
}: {
  trigger: ComponentPropsWithoutRef<typeof Modal>["trigger"];
}) => {
  const [isDeletingMode, setIsDeletingMode] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  return (
    <PlaylistContext.Provider
      value={{
        isDeletingMode,
        setIsDeletingMode,
        deletingIds,
        setDeletingIds,
      }}
    >
      <Modal trigger={trigger} modal={<ModalContent />} />
    </PlaylistContext.Provider>
  );
};

const ModalContent = () => {
  const { query } = useRouter();

  const { isDeletingMode, setIsDeletingMode, deletingIds, setDeletingIds } =
    usePlaylistContext();

  const [playlist] = useRecoilState(playlistAtomState);

  const { publish: removeItem } = useRemovePlaylistItem(Number(query.roomId));

  const isHost = useRecoilValue(isHostAtomState);
  const playlistId = useRecoilValue(playlistIdAtomState);

  useIsViewedPlaylistItemIds.IfUnmount(playlist);

  return (
    <Layout screenColor="rgba(0, 0, 0, 0.85)">
      <TopBar
        leftIconButton={
          <Modal.Close as={TopBarIconButton} iconName="arrow-left" />
        }
        rightIconButton={
          isHost ? (
            isDeletingMode ? (
              <S.CancelText onClick={() => setIsDeletingMode(false)}>
                취소
              </S.CancelText>
            ) : (
              <TopBarIconButton
                iconName="bin"
                onClick={() => setIsDeletingMode(true)}
              />
            )
          ) : (
            <></>
          )
        }
      >
        {isDeletingMode ? "삭제할 음악을 선택해주세요" : "플레이리스트"}
      </TopBar>
      {isHost ? <Playlist.Host /> : <Playlist.Guest />}

      {isHost && isDeletingMode ? (
        <S.DeleteButton
          disabled={deletingIds.length === 0}
          onClick={() => {
            removeItem({ playlistId, playlistItemIds: deletingIds });
            setDeletingIds([]);
          }}
        >
          {`${deletingIds.length}`.padStart(2, "0")} 삭제하기
        </S.DeleteButton>
      ) : (
        <></>
      )}
    </Layout>
  );
};

export default PlaylistModal;

const S = {
  MusicList: styled.ul``,
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

    position: sticky;
    bottom: 18px;
    left: 50%;
    transform: translateX(-50%);

    :disabled {
      filter: contrast(0.5);
      cursor: not-allowed;
    }
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
