import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useRecoilState } from "recoil";
import { playlistAtomState } from "~/store/playlist";
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
  const [playlist] = useRecoilState(playlistAtomState);

  const noData = !playlist || playlist.length === 0;
  const nextMusic =
    playlist[getMusicIndex(currentMusic?.playlistItemId, playlist) + 1];

  return (
    <S.Container>
      <S.UpperCard>
        <S.Title>Playlist</S.Title>
        <S.Content>
          {noData ? (
            <S.NoDataText>{NO_DATA_TEXT[0]}</S.NoDataText>
          ) : (
            <>
              <div
                css={css`
                  width: 100%;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  word-break: break-word;

                  display: -webkit-box;
                  -webkit-line-clamp: 2; // 원하는 라인수
                  -webkit-box-orient: vertical;
                `}
              >
                {currentMusic.title}
              </div>
              <S.Duration>
                {getDurationText(currentMusic.duration || 0)}
              </S.Duration>
            </>
          )}
        </S.Content>
      </S.UpperCard>
      <S.MiddleCard>
        <S.Content>
          {noData ? (
            <S.NoDataText>{NO_DATA_TEXT[1]}</S.NoDataText>
          ) : (
            <>
              <div
                css={css`
                  width: 100%;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  word-break: break-word;

                  display: -webkit-box;
                  -webkit-line-clamp: 2; // 원하는 라인수
                  -webkit-box-orient: vertical;
                `}
              >
                {nextMusic?.title || "-"}
              </div>
              <S.Duration>
                {getDurationText(nextMusic?.duration || 0)}
              </S.Duration>
            </>
          )}
        </S.Content>
      </S.MiddleCard>
      <PlaylistModal
        trigger={({ open }) => (
          <S.LowerCard onClick={open}>+ 더보기</S.LowerCard>
        )}
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
    /* flex-shrink: 0; */
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
    background: #6369dd44;
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 20px;
    border-bottom: 2px dashed #000000;
  `,
  MiddleCard: styled.div`
    height: 30%;
    background: #6369dd44 linear-gradient(transparent, #585ff044);

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
    background: #585ff0;
    backdrop-filter: blur(20px);
    padding: 20px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    font-weight: 600;
    font-size: 16px;
    line-height: 19px;

    transition: all 200ms;

    &:hover {
      opacity: 0.85;
    }

    &:disabled {
      cursor: not-allowed;
      filter: contrast(0.8);
    }
  `,
  Content: styled.div`
    font-weight: 500;
    font-size: 15px;
    line-height: 19px;
    letter-spacing: -0.02em;
  `,
  Duration: styled.div`
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    color: rgba(255, 255, 255, 0.64);
    letter-spacing: -0.02em;
    margin-top: 4px;
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
