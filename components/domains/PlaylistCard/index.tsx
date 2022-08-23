import React from "react";
import styled from "@emotion/styled";
import { useRecoilState } from "recoil";
import { Modal } from "~/components/uis";
import { useRoomStore } from "~/store";
import { playlistAtomState } from "~/store/playlist";
import { playerAtomState } from "~/store/room";
import { getDurationText, getMusicIndex } from "~/store/room/utils";
import type { PlaylistItem } from "~/types";
import PlaylistModal from "../PlaylistModal";

interface PlaylistCardProps {
  currentMusic: PlaylistItem;
}

const NO_DATA_TEXT = [
  "대기 중인\n노래가없어요.",
  "원하는 곡을\n플리에 추가해보세요.",
];

function PlaylistCard({ currentMusic }: PlaylistCardProps) {
  const [playerState, setPlayerState] = useRecoilState(playerAtomState);
  const [playlist, setPlaylist] = useRecoilState(playlistAtomState);

  const playPrevMusic = () => {
    const playingIndex = getMusicIndex(playerState.playingMusicId, playlist);
    if (playingIndex === 0) {
      return null;
    }

    setPlayerState((prev) => ({
      ...prev,
      playingMusicId: playlist[playingIndex - 1].id,
    }));
  };

  const playNextMusic = () => {
    const playingIndex = getMusicIndex(playerState.playingMusicId, playlist);
    if (playingIndex === playlist.length - 1) {
      return null;
    }

    setPlayerState((prev) => ({
      ...prev,
      playingMusicId: playlist[playingIndex + 1].id,
    }));
  };

  const noData = !playlist || playlist.length === 0;
  const nextMusic = playlist[getMusicIndex(currentMusic?.id, playlist) + 1];

  return (
    <S.Container>
      {/* 카드 상단 */}
      <S.UpperCard onClick={playPrevMusic}>
        <S.Title>Playlist</S.Title>
        <S.Content>
          {noData ? (
            <S.NoDataText>{NO_DATA_TEXT[0]}</S.NoDataText>
          ) : (
            <>
              <div>{currentMusic.title}</div>
              <S.Duration>
                {getDurationText(currentMusic.duration || 0)}
              </S.Duration>
            </>
          )}
        </S.Content>
      </S.UpperCard>

      {/* 카드 중간 */}
      <S.MiddleCard onClick={playNextMusic}>
        <S.Content>
          {noData ? (
            <S.NoDataText>{NO_DATA_TEXT[1]}</S.NoDataText>
          ) : (
            <>
              <div>{nextMusic?.title || "-"}</div>
              <S.Duration>
                {getDurationText(nextMusic?.duration || 0)}
              </S.Duration>
            </>
          )}
        </S.Content>
      </S.MiddleCard>

      {/* 카드 하단 */}
      <Modal
        trigger={({ open }) => (
          <S.LowerCard onClick={open}>+ 더보기</S.LowerCard>
        )}
        modal={<PlaylistModal />}
      />
    </S.Container>
  );
}

const S = {
  Container: styled.div`
    width: 220px;
    height: 314px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  `,
  Title: styled.h3`
    font-weight: 800;
    font-size: 14px;
    line-height: 17px;
    margin-bottom: 35px;
  `,
  UpperCard: styled.div`
    cursor: pointer;
    height: 50%;
    background: #ff793a;
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 20px;
    border-bottom: 2px dashed #000000;
  `,
  MiddleCard: styled.div`
    cursor: pointer;
    height: 30%;
    background: #ff793a;

    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 20px;
    border-bottom: 2px dashed #000000;

    display: flex;
    align-items: center;
  `,
  LowerCard: styled.div`
    cursor: pointer;
    height: 20%;
    background: #ff5100;
    backdrop-filter: blur(20px);
    padding: 20px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    font-weight: 800;
    font-size: 16px;
    line-height: 19px;
  `,
  Content: styled.div`
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: -0.02em;
  `,
  Duration: styled.div`
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    color: rgba(255, 255, 255, 0.64);
    letter-spacing: -0.02em;
    margin-top: 6px;
  `,
  NoDataText: styled.div`
    font-weight: 600;
    font-size: 16px;
    line-height: 145%;
    letter-spacing: -0.02em;
    white-space: pre-wrap;
  `,
};

export default PlaylistCard;
