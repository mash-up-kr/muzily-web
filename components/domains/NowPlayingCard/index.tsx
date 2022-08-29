import React from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import { useRecoilState, useRecoilValue } from "recoil";
import { Modal } from "~/components/uis";
import LottieAnimation from "~/components/uis/LottieAnimation";
import usePlayerActions from "~/hooks/domains/usePlayerActions";
import { isHostAtomState, playerAtomState } from "~/store/room";
import type { PlaylistItem } from "~/types";
import AddSongScreen from "../AddSongScreen";
import Thumbnail from "../Thumbnail";

interface NowPlayingCardProps {
  noPlaylist?: boolean;
  currentMusic: PlaylistItem;
  player?: any;
}

function NowPlayingCard({
  noPlaylist = false,
  currentMusic,
  player,
}: NowPlayingCardProps) {
  const isHost = useRecoilValue(isHostAtomState);

  const [playerState] = useRecoilState(playerAtomState);

  const { playNextMusic, playPrevMusic } = usePlayerActions();

  // 재생 중인 노래 없는경우
  if (noPlaylist) {
    return (
      <Modal
        modal={({ close }) => <AddSongScreen onClickBackButton={close} />}
        trigger={({ open }) => (
          <S.Container noPlaylist onClick={open}>
            <S.Title>Now Playing</S.Title>
            <S.Content>
              <S.NoPlaylistText>{`재생 중인\n노래가 없어요`}</S.NoPlaylistText>

              <Image
                src="/images/no-music-emoji.svg"
                alt="no-music"
                width={160}
                height={160}
              />

              <S.SubText>지금 바로 추가해보세요</S.SubText>
            </S.Content>
          </S.Container>
        )}
      />
    );
  }
  const musicText = `${currentMusic.title}`;

  return (
    <S.Container>
      <S.Title>Now Playing</S.Title>
      <Thumbnail
        src={currentMusic.thumbnail}
        color={currentMusic.dominantColor}
      />

      {isHost ? (
        <S.Controller>
          <Image
            src="/images/play-back.svg"
            alt="play-back"
            width={36}
            height={36}
            onClick={playPrevMusic}
          />
          {playerState.isPlaying ? (
            <Image
              src="/images/pause-button.svg"
              alt="play-back"
              width={80}
              height={80}
              onClick={() => player.pauseVideo()}
            />
          ) : (
            <Image
              // 임시
              src="/images/play.svg"
              alt="play"
              width={80}
              height={80}
              onClick={() => player.playVideo()}
            />
          )}
          <Image
            src="/images/play-next.svg"
            alt="play-next"
            width={36}
            height={36}
            onClick={playNextMusic}
          />
        </S.Controller>
      ) : (
        <S.Controller>
          <LottieAnimation.Equalizer
            height={60}
            width={70}
            color="white"
            isPaused={!playerState.isPlaying}
          />
        </S.Controller>
      )}

      <S.MusicText>{musicText}</S.MusicText>
    </S.Container>
  );
}

const S = {
  Container: styled.div<{ noPlaylist?: boolean }>`
    cursor: pointer;
    position: relative;
    height: 45vh;

    background: ${(p) => (p.noPlaylist ? "#007aff" : "#fff")};
    border-radius: 20px;
    padding: 20px;

    /* flex-shrink: 0; */
  `,

  Title: styled.h3`
    margin: 0;
    font-weight: 800;
    font-size: 14px;
    line-height: 17px;
    color: #fff;

    position: absolute;
    top: 20px;
    z-index: 1;
  `,
  Content: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
  `,

  NoPlaylistText: styled.div`
    text-align: center;
    white-space: pre-wrap;
  `,

  SubText: styled.div`
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: -0.04em;
    color: rgba(255, 255, 255, 0.65);
  `,

  Controller: styled.div`
    display: ${(p) => (p.hidden ? "none" : "flex")};
    width: 100%;
    height: 90%;
    justify-content: center;
    align-items: center;
    gap: 25px;
  `,

  MusicText: styled.div`
    color: #fff;
    z-index: 1;
    position: absolute;
    font-weight: 600;
    font-size: 20px;
    line-height: 145%;
    letter-spacing: -0.544648px;

    left: 0;
    bottom: 0;

    width: 100%;

    padding: 0 20px;
    bottom: 30px;

    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
};

export default NowPlayingCard;
