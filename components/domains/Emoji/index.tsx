import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import type { Variant } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import Heart from "~/assets/svgs/Heart";
import { IconButton, Modal, Spacer, LongPress, Toast } from "~/components/uis";
import { useTimeoutFn } from "~/hooks/commons";
import { useEmoji } from "~/hooks/webSocket";
import { Hearts } from "./heart";

const STAGE_1_MAX_PERCENTAGE = 20;
const STAGE_2_MAX_PERCENTAGE = 50;
const STAGE_3_MAX_PERCENTAGE = 100;

const Emoji = () => {
  const { query } = useRouter();
  const { publish } = useEmoji(Number(query.roomId), {
    emojiType: "HEART",
    intensity: 100,
  });
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
                threshold={4000}
                onPressOut={({ percentage }) => {
                  setPop({ isPopping: true, percentage });
                  publish({ emojiType: "HEART", intensity: percentage });
                  close();
                }}
                onTooLongPress={() => {
                  Toast.show("4초 안에 이모지를 놓아주세요~", {
                    status: "info",
                    delay: 0,
                  });

                  close();
                }}
                trigger={({ register, isProcessing, percentage }) => {
                  const stage0: Variant = { scale: 0.8 };
                  const stage1: Variant = { scale: 1.2 };
                  const stage2: Variant = { scale: 1.6 };
                  const stage3: Variant = { scale: 2 };

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
                    <motion.div>
                      <Heart
                        {...register()}
                        initial={{
                          scale: 4,
                          filter: "drop-shadow(0px 0px 0px white)",
                        }}
                        whileTap={{
                          rotate: [0, 5, 0, 0, -5, 0],
                          transition: { repeat: Infinity, duration: 0.3 },
                        }}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          userSelect: "none",
                          cursor: "pointer",
                        }}
                        animate={{
                          scale: (
                            (isStage1 && stage1) ||
                            (isStage2 && stage2) ||
                            (isStage3 && stage3) ||
                            stage0
                          ).scale,
                          filter: "drop-shadow(0px 0px 30px white)",
                        }}
                      />
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
};

const getStage = (percentage: number) =>
  percentage > 0 && percentage < STAGE_1_MAX_PERCENTAGE
    ? 1
    : percentage >= STAGE_1_MAX_PERCENTAGE &&
      percentage < STAGE_2_MAX_PERCENTAGE
    ? 2
    : 3;

export default Emoji;

const S = {
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
