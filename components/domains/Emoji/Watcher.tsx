import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRecoilValue } from "recoil";
import { useTimeout } from "~/hooks/commons";
import { emojiAtomState } from "~/store/emoji";
import type { Emoji } from "~/types";
import { Hearts } from "./heart";
import { getStage } from "./helpers";

const Watcher = () => {
  const [emojis, setEmojis] = useState<Emoji[]>([]);

  const emojiState = useRecoilValue(emojiAtomState);

  useEffect(() => {
    setEmojis((current) => [...current, emojiState]);
  }, [emojiState]);

  if (!emojiState) {
    return null;
  }

  return (
    <>
      {emojis.map((emoji, index) => (
        <ExposeDurationEmoji key={index} emoji={emoji} />
      ))}
    </>
  );
};

export default Watcher;

const ExposeDurationEmoji = (props: { emoji: Emoji }) => {
  const [emoji, setEmoji] = useState<Emoji | null>(props.emoji);
  useTimeout(() => {
    setEmoji(null);
  }, 2000);

  return (
    <AnimatePresence exitBeforeEnter>
      {emoji && (
        <motion.div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.1)",
            zIndex: -1,
            pointerEvents: "none",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Hearts stage={getStage(emoji.intensity)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
