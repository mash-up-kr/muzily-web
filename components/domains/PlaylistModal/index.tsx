import type { ComponentPropsWithoutRef } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { useRecoilState, useRecoilValue } from "recoil";
import { Layout, Modal, TopBar, TopBarIconButton } from "~/components/uis";
import { useRemovePlaylistItem } from "~/hooks/webSocket";
import { useRoomStore } from "~/store";
import { playlistAtomState } from "~/store/playlist";
import { playlistIdAtomState } from "~/store/room";
import { PlaylistContext } from "./context";
import Playlist from "./Playlist";

const PlaylistModal = ({
  trigger,
}: {
  trigger: ComponentPropsWithoutRef<typeof Modal>["trigger"];
}) => {
  const {
    state: { isHost },
    actions,
  } = useRoomStore();

  const router = useRouter();
  const { roomId } = router.query;

  const { publish: removeItem } = useRemovePlaylistItem(Number(roomId), {
    playlistId: -1,
    playlistItemIds: [],
  });

  const [playlist] = useRecoilState(playlistAtomState);
  const playlistId = useRecoilValue(playlistIdAtomState);

  const [isDeletingMode, setIsDeletingMode] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  useEffect(() => {
    // setPlaylist in socket
  }, [playlist]);

  return (
    <PlaylistContext.Provider
      value={{
        isDeletingMode,
        setIsDeletingMode,
        deletingIds,
        setDeletingIds,
      }}
    >
      <Modal
        trigger={trigger}
        modal={({ close }) => {
          return (
            <Layout screenColor="rgba(0, 0, 0, 0.85)">
              <TopBar
                leftIconButton={
                  <TopBarIconButton iconName="arrow-left" onClick={close} />
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
                {isDeletingMode ? "삭제할 음악을 선택해주세요" : "Playlist"}
              </TopBar>
              {isHost ? <Playlist.Host /> : <Playlist.Guest />}

              {isHost && deletingIds.length ? (
                <S.DeleteButton
                  onClick={() => {
                    removeItem({ playlistId, playlistItemIds: deletingIds });
                    setDeletingIds([]);
                    close();
                  }}
                >
                  {`${deletingIds.length}`.padStart(2, "0")} 삭제하기
                </S.DeleteButton>
              ) : (
                <></>
              )}
            </Layout>
          );
        }}
      />
    </PlaylistContext.Provider>
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
