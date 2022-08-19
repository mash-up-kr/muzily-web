import React, { useEffect, useMemo, useRef, useState } from "react";
import type { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import type { Variant } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import Vibrant from "node-vibrant";
import YouTube from "react-youtube";
import { VIDEO_LIST } from "~/assets/dummy";
import Heart from "~/assets/svgs/Heart";
import {
  LongPress,
  NowPlayingCard,
  PlaylistCard,
  AddSongScreen,
  MoodScreen,
} from "~/components/domains";
import QRCodeCard from "~/components/domains/QRCodeCard";
import { Modal, Spacer, IconButton } from "~/components/uis";
import { useTimeout, useTimeoutFn } from "~/hooks/commons";
import { useRoomStore } from "~/store";
import type { Music } from "~/types/musics";

interface Props {
  musicData: Music[];
  isHost: boolean;
}

const RoomPage: NextPage<Props> = ({ musicData, isHost: host }) => {
  const router = useRouter();
  const { roomId } = router.query as { roomId: string };
  const {
    state: { playingMusicId, playList, isHost, proposedMusicList },
    actions,
  } = useRoomStore();
  const contentRef = useRef<HTMLDivElement>(null);

  const [player, setPlayer] = useState(null);
  const currentMusic = useMemo(
    () => playList.find((item) => item.id === playingMusicId) || playList[0],
    [playingMusicId, playList]
  );

  useEffect(() => {
    actions.init(host ? [] : VIDEO_LIST, host, "");
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      const contentWidth = contentRef.current.offsetWidth;
      contentRef.current.scrollTo({ left: contentWidth / 2 });
    }
  }, [contentRef]);

  return (
    <>
      <Spacer
        type="vertical"
        justify="space-between"
        style={{ height: "100%" }}
      >
        <S.Header>
          <S.Title>매쇼~쉬는탐</S.Title>
          <S.Desc>곡을 추가하거나 좋아요를 해보세요!</S.Desc>
        </S.Header>

        <S.ContentWrapper ref={contentRef}>
          <QRCodeCard roomId={roomId} />
          <NowPlayingCard
            noPlaylist={!playList.length}
            currentMusic={currentMusic}
            player={player}
          />

          <PlaylistCard currentMusic={currentMusic} />
        </S.ContentWrapper>

        <Spacer justify="center" gap={36} style={{ margin: "0 0 32px 0" }}>
          <Actions.NewMusic value={isHost ? proposedMusicList.length : 0} />
          <Actions.Emoji />
          {/* XXX: User test를 위한 임시값 */}
          <Actions.ChangeMood value={isHost ? 2 : 0} />
        </Spacer>
      </Spacer>

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
  Header: styled.div`
    margin: 30px 0 0 16px;
  `,
  Title: styled.h1`
    font-weight: 700;
    font-size: 28px;
    line-height: 155%;
  `,
  Desc: styled.h4`
    font-weight: 500;
    font-size: 14px;
    line-height: 145%;
    letter-spacing: -0.02em;
    color: #6b6b6b;
    margin-bottom: 34px;
  `,
  ContentWrapper: styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    overflow-x: auto;
    width: 100%;
    ::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
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

    const [run, clear] = useTimeoutFn(() => {
      setPop({ isPopping: false, percentage: 0 });
    }, 2500);

    useEffect(() => {
      if (pop.isPopping) {
        run();
      }

      if (!pop.isPopping) {
        clear();
      }
    }, [pop.isPopping]);

    return (
      <>
        <Modal
          trigger={
            <Spacer type="vertical" align="center" gap={8}>
              <Modal.Open
                as={IconButton}
                onClick={() => setPop({ isPopping: false, percentage: 0 })}
                iconName="heart"
                style={{ userSelect: "none" }}
              />
              <S.IconText>좋아요</S.IconText>
            </Spacer>
          }
          modal={({ close }) => (
            <>
              <Modal.Overlay />
              <Spacer type="vertical" justify="center" gap={100}>
                <motion.div
                  initial={{ y: -30 }}
                  animate={{
                    y: [0, 20, 0, 20, 0],
                    transition: { repeat: Infinity, repeatDelay: 3 },
                  }}
                  whileHover={{ y: 40 }}
                >
                  <p
                    style={{
                      fontSize: 30,
                      fontWeight: 900,
                      textAlign: "center",
                      color: "white",
                      filter: "drop-shadow(0px 0px 30px white)",
                    }}
                  >
                    좋아하는 만큼
                    <br />
                    꾸욱~ 길게 눌러주세요!
                  </p>
                </motion.div>

                <LongPress
                  threshold={2500}
                  onPressOut={({ percentage }) => {
                    setPop({ isPopping: true, percentage });

                    close();
                  }}
                  onTooLongPress={close}
                  trigger={({ register, isProcessing, percentage }) => {
                    const rotate = [-5, 5, -5];

                    const stage0: Variant = { scale: 1 };
                    const stage1: Variant = { scale: 2 };
                    const stage2: Variant = { scale: 3 };
                    const stage3: Variant = { scale: 5 };

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
                        <motion.div
                          {...register()}
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
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            userSelect: "none",
                            cursor: "pointer",
                          }}
                        >
                          <Heart
                            animate={{
                              scale: 4,
                              filter: "drop-shadow(0px 0px 30px white)",
                            }}
                          />
                        </motion.div>
                      </motion.div>
                    );
                  }}
                />
                <div />
              </Spacer>
            </>
          )}
        />
        <AnimatePresence exitBeforeEnter>
          {pop.isPopping && (
            <motion.div
              style={{
                position: "absolute",
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
      </>
    );
  },
  ChangeMood: ({ value }: { value: number }) => {
    return (
      <Spacer type="vertical" align="center" gap={8}>
        <Modal
          trigger={({ open }) => (
            <IconButton iconName="union" onClick={open} badgeValue={value} />
          )}
          modal={({ close }) => <MoodScreen onClickBackButton={close} />}
        />
        <S.IconText>무드변경</S.IconText>
      </Spacer>
    );
  },
};

const STAGE_1_MAX_PERCENTAGE = 20;
const STAGE_2_MAX_PERCENTAGE = 50;
const STAGE_3_MAX_PERCENTAGE = 100;

const Hearts = ({ stage }: { stage: 1 | 2 | 3 }) => {
  return (
    <>
      {Array.from({ length: stage === 3 ? 20 : stage === 2 ? 50 : 40 }).map(
        (_, index) => (
          <Heart3D key={index} stage={stage} />
        )
      )}
    </>
  );
};

const Heart3D = ({ stage }: { stage: 1 | 2 | 3 }) => {
  const getRandomHalfToFull = () => Math.random() / 4 + 3 / 4;
  const randomMinus = Math.random() > 0.5 ? 1 : -1;

  return (
    <motion.div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: stage === 3 ? 140 : 1,
      }}
      initial={{
        x: (randomMinus * window.innerWidth * Math.random()) / 2,
        y: 400 * getRandomHalfToFull(),
      }}
      animate={{
        x: (randomMinus * window.innerWidth * Math.random()) / 2,
        y: -2000 * getRandomHalfToFull(),

        opacity: Math.random() * 0.9 + 0.1,
      }}
      transition={{ duration: 3 * getRandomHalfToFull() }}
    >
      <Heart animate={{ scale: stage === 1 ? 2 : stage * stage }} />
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
