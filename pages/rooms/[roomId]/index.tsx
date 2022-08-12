import React, { useEffect, useMemo, useState } from "react";
import type { NextPage, NextPageContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import type { Variant } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import Vibrant from "node-vibrant";
import YouTube from "react-youtube";
import { VIDEO_LIST } from "~/assets/dummy";
import {
  LongPress,
  NowPlayingCard,
  PlaylistCard,
  AddSongScreen,
  MoodScreen,
  ChangeMoodScreen,
} from "~/components/domains";
import QRCodeCard from "~/components/domains/QRCodeCard";
import { Modal, Spacer, IconButton } from "~/components/uis";
import { useRoomStore } from "~/store";
import type { Music } from "~/types/musics";

const TITLE = "매쇼~쉬는탐";
const DESC = "곡을 추가하거나 좋아요를 해보세요!";
interface RoomPageProps {
  musicData: Music[];
  isHost: boolean;
}

const RoomPage: NextPage<RoomPageProps> = ({ musicData, isHost: host }) => {
  const router = useRouter();
  const { roomId } = router.query as { roomId: string };
  const {
    state: { playingMusicId, playList, isHost, proposedMusicList },
    actions,
  } = useRoomStore();

  const [player, setPlayer] = useState(null);
  const currentMusic = useMemo(
    () => playList.find((item) => item.id === playingMusicId) || playList[0],
    [playingMusicId, playList]
  );

  useEffect(() => {
    actions.init(host ? [] : VIDEO_LIST, host);
  }, []);

  return (
    <>
      <S.Container>
        <S.Header>
          <S.Title>{TITLE}</S.Title>
          <S.Desc>{DESC}</S.Desc>
        </S.Header>

        <S.ContentWrapper>
          <QRCodeCard roomId={roomId} />
          <NowPlayingCard
            noPlaylist={!playList.length}
            currentMusic={currentMusic}
            player={player}
          />

          <PlaylistCard currentMusic={currentMusic} />
        </S.ContentWrapper>

        <S.IconWrapper>
          <Actions.NewMusic value={isHost ? proposedMusicList.length : 0} />
          <Actions.Emoji />
          <Actions.ChangeMood />
        </S.IconWrapper>
      </S.Container>

      {isHost && currentMusic && (
        <S.YoutubeWrapper hidden>
          <YouTube
            id="iframe"
            videoId={currentMusic.id}
            opts={{
              width: 300,
              height: 200,
              playerVars: {
                autoplay: 1,
                controls: 1,
              },
            }}
            onPlay={() => actions.setIsPlaying(true)}
            onPause={() => actions.setIsPlaying(false)}
            onReady={(event) => {
              setPlayer(event.target);
              event.target.playVideo();
            }}
            onEnd={() => {
              if (playingMusicId === playList[playList.length - 1].id) {
                return alert("끝!!");
              }

              actions.playNextMusic();
            }}
          />
        </S.YoutubeWrapper>
      )}
    </>
  );
};

const S = {
  Container: styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 0;
  `,
  Header: styled.div``,
  Title: styled.h1`
    font-weight: 700;
    font-size: 28px;
    line-height: 155%;
    margin: 10px 0 0;
  `,
  Desc: styled.h4`
    font-weight: 500;
    font-size: 14px;
    line-height: 145%;
    letter-spacing: -0.02em;
    color: #6b6b6b;
    margin: 8px 0 0;
    margin-bottom: 34px;
  `,
  IconWrapper: styled.div`
    display: flex;
    gap: 36px;
    margin-top: 22px;
    justify-content: center;
  `,
  ContentWrapper: styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    gap: 20px;
    overflow-x: auto;
    padding: 0 20px;
    margin-left: -20px;
    width: calc(100% + 40px);
  `,
  YoutubeWrapper: styled.div<{ hidden: boolean }>`
    visibility: ${(p) => p.hidden && "hidden"};
  `,
  IconText: styled.span`
    font-weight: 600;
    font-size: 14px;
    line-height: 155%;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: -0.498081px;
  `,
};

RoomPage.getInitialProps = async (ctx: NextPageContext) => {
  const isHost = ctx.query.isHost === "true";
  const list = [...VIDEO_LIST];
  const musicData: Music[] = await Promise.all(
    list.map(async (el) => {
      try {
        const palette = await Vibrant.from(el.thumbnail).getPalette();
        const colors = Object.values(palette).map(
          (swatches) => swatches?.hex || ""
        );

        return {
          ...el,
          colors,
        };
      } catch (error) {
        console.error(error);

        return el;
      }
    })
  );

  return {
    isHost,
    musicData,
  };
};

export default RoomPage;

const STAGE_1_MAX_PERCENTAGE = 20;
const STAGE_2_MAX_PERCENTAGE = 50;
const STAGE_3_MAX_PERCENTAGE = 100;

const Actions = {
  NewMusic: ({ value }: { value: number }) => (
    <Spacer type="vertical" align="center" gap={8}>
      <Modal
        trigger={({ open }) => (
          <IconButton iconName="star" onClick={open} badgeValue={value} />
        )}
        modal={({ close }) => <AddSongScreen onClickBackButton={close} />}
      />
      <S.IconText>곡추가</S.IconText>
    </Spacer>
  ),
  Emoji: () => {
    const [isHover, setIsHover] = useState(false);
    const [pop, setPop] = useState({ isPopping: false, percentage: 0 });

    return (
      <>
        <AnimatePresence exitBeforeEnter>
          {pop.isPopping && (
            <motion.div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.1)",
                zIndex: 9999999,
                pointerEvents: "none",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hearts stage={getStage(pop.percentage)} />
            </motion.div>
          )}
        </AnimatePresence>
        <Spacer type="vertical" align="center" gap={8}>
          <LongPress
            threshold={7000}
            trigger={({ register, isProcessing, percentage }) => {
              const rotate = [-5, 5, -5];

              const stage0: Variant = { scale: 1 };
              const stage1: Variant = { scale: 2.6 };
              const stage2: Variant = { scale: 10 };
              const stage3: Variant = { scale: 23 };

              const isStage1 =
                isProcessing &&
                percentage > 0 &&
                percentage < STAGE_1_MAX_PERCENTAGE;
              const isStage2 =
                isProcessing &&
                percentage > STAGE_1_MAX_PERCENTAGE &&
                percentage < STAGE_2_MAX_PERCENTAGE;
              const isStage3 =
                isProcessing &&
                percentage > STAGE_2_MAX_PERCENTAGE &&
                percentage < STAGE_3_MAX_PERCENTAGE;

              return (
                <motion.div
                  onHoverStart={() => setIsHover(true)}
                  onHoverEnd={() => setIsHover(false)}
                  animate={{
                    rotate: isHover || isProcessing ? rotate : 0,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: isHover || isProcessing ? 0.2 : 0,
                  }}
                >
                  <IconButton
                    {...register()}
                    iconName="heart"
                    animate={
                      (isStage1 && stage1) ||
                      (isStage2 && stage2) ||
                      (isStage3 && stage3) ||
                      stage0
                    }
                    transition={{
                      duration:
                        isStage1 || isStage2 || isStage3
                          ? 0.5
                          : isProcessing
                          ? 1
                          : 0,
                    }}
                    style={{ userSelect: "none" }}
                  />
                </motion.div>
              );
            }}
            onPressOut={({ percentage }) => {
              setPop({ isPopping: true, percentage });
              setTimeout(() => {
                setPop({ isPopping: false, percentage });
              }, 2500);
            }}
          />
          <S.IconText>좋아요</S.IconText>
        </Spacer>
      </>
    );
  },
  ChangeMood: () => {
    return (
      <Spacer type="vertical" align="center" gap={8}>
        <Modal
          trigger={({ open }) => <IconButton iconName="union" onClick={open} />}
          modal={({ close }) => <ChangeMoodScreen onClickBackButton={close} />}
        />
        <S.IconText>무드변경</S.IconText>
      </Spacer>
    );
  },
};

const Hearts = ({ stage }: { stage: 1 | 2 | 3 }) => (
  <>
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
    <Heart3D stage={stage} />
  </>
);

const Heart3D = ({ stage }: { stage: 1 | 2 | 3 }) => {
  const getRandomHalfToFull = () => Math.random() / 3 + 2 / 3;

  const width = stage * stage * 38;

  return (
    <motion.div
      initial={{
        x: window.innerWidth * Math.random() - width / 2,
        y: 600 * getRandomHalfToFull() - width / 2,
        opacity: Math.random() * 0.3 + 0.7,
      }}
      animate={{
        x: window.innerWidth * Math.random() - width / 2,
        y: -1300 * getRandomHalfToFull() - width / 2,
        opacity: Math.random() * 0.9 + 0.1,
      }}
      transition={{ duration: 4 * getRandomHalfToFull() }}
    >
      <Image
        src={"/images/heart.svg"}
        alt={"icon"}
        width={width}
        height={width}
      />
    </motion.div>
  );
};

const getStage = (percentage: number) =>
  percentage > 0 && percentage < STAGE_1_MAX_PERCENTAGE
    ? 1
    : percentage >= STAGE_1_MAX_PERCENTAGE &&
      percentage < STAGE_2_MAX_PERCENTAGE
    ? 2
    : 3;
