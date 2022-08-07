import React from "react";
import styled from "@emotion/styled";
import { useRoomStore } from "~/store";
import type { Music } from "~/types/musics";

interface PlaylistCardProps {
  currentMusic: Music;
}

const NO_DATA_TEXT = [
  "대기 중인\n노래가없어요.",
  "원하는 곡을\n플리에 추가해보세요.",
];

function PlaylistCard({ currentMusic }: PlaylistCardProps) {
  const {
    state: { playList },
    actions,
  } = useRoomStore();
  const noData = !playList || playList.length === 0;
  const nextMusic = playList[actions.getMusicIndex(currentMusic?.id) + 1];

  return (
    <S.Container>
      {/* 카드 상단 */}
      <S.UpperCard onClick={actions.playPrevMusic}>
        <S.Title>Playlist</S.Title>
        <S.Content>
          {noData ? (
            <S.NoDataText>{NO_DATA_TEXT[0]}</S.NoDataText>
          ) : (
            <>
              <div>{currentMusic.title}</div>
              <S.Artist>{currentMusic.artist}</S.Artist>
            </>
          )}
        </S.Content>
      </S.UpperCard>

      {/* 카드 중간 */}
      <S.MiddleCard onClick={actions.playNextMusic}>
        <S.Content>
          {noData ? (
            <S.NoDataText>{NO_DATA_TEXT[1]}</S.NoDataText>
          ) : (
            <>
              <div>{nextMusic?.title || "-"}</div>
              <S.Artist>{nextMusic?.artist || "-"}</S.Artist>
            </>
          )}
        </S.Content>
      </S.MiddleCard>

      {/* 카드 하단 */}
      <S.LowerCard onClick={() => actions.setOpenPlaylistScreen(true)}>
        + 더보기
      </S.LowerCard>
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
  Artist: styled.div`
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
