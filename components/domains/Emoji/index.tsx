import { useRouter } from "next/router";
import styled from "@emotion/styled";
import type { Variant } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { Book, Heart, MirrorBall } from "~/assets/svgs";
import { IconButton, Modal, Spacer, LongPress, Toast } from "~/components/uis";
import { MemberInfo } from "~/contexts";
import { useRoomQuery } from "~/hooks/api";
import { useEmoji } from "~/hooks/webSocket";
import { STAGE } from "./constants";
import Watcher from "./Watcher";

const Emoji = () => {
  const { query } = useRouter();
  const { publish } = useEmoji(Number(query.roomId));
  const { data: roomData } = useRoomQuery(Number(query.roomId));
  const emoijiType = roomData?.mood.emojiType ?? "HEART";

  return (
    <MemberInfo.Only fallback={<></>}>
      {({ memberInfo }) => (
        <>
          <Modal
            trigger={
              <Spacer type="vertical" align="center" gap={8}>
                <Modal.Open
                  as={IconButton}
                  iconName="heart"
                  style={{ userSelect: "none" }}
                />
                <S.IconText>좋아요</S.IconText>
              </Spacer>
            }
            modal={({ close }) => (
              <>
                <Modal.Overlay />
                <Spacer type="vertical" justify="center" gap={30}>
                  <motion.div
                    initial={{ y: -30 }}
                    animate={{
                      y: [0, 20, 0, 20, 0],
                      transition: { repeat: 1, repeatDelay: 3 },
                    }}
                    whileHover={{ y: 40 }}
                  >
                    <p
                      style={{
                        fontSize: 20,
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
                      publish({
                        emojiType: emoijiType,
                        intensity: percentage,
                        messageText: "좋아요",
                      });
                      setTimeout(() => {
                        close();
                      }, 10);
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
                        percentage < STAGE._1_MAX_PERCENTAGE;
                      const isStage2 =
                        isProcessing &&
                        percentage > STAGE._1_MAX_PERCENTAGE &&
                        percentage < STAGE._2_MAX_PERCENTAGE;
                      const isStage3 =
                        isProcessing &&
                        percentage > STAGE._2_MAX_PERCENTAGE &&
                        percentage < STAGE._3_MAX_PERCENTAGE;

                      const EmojiSVG =
                        emoijiType === "HEART"
                          ? Heart
                          : emoijiType === "BOOK"
                          ? Book
                          : MirrorBall;

                      return (
                        <EmojiSVG
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
                      );
                    }}
                  />
                  <div />
                  <div />
                </Spacer>
              </>
            )}
          />

          <Watcher />
        </>
      )}
    </MemberInfo.Only>
  );
};

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
