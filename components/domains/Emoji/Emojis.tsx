import { motion } from "framer-motion";
import { useRecoilValue } from "recoil";
import { Book, Heart, MirrorBall, Note } from "~/assets/svgs";
import { useLayoutWidth } from "~/components/uis/Layout";
import { emojiAtomState } from "~/store/emoji";

const Emojis = ({ stage }: { stage: 1 | 2 | 3 }) => {
  return (
    <>
      {Array.from({ length: stage === 1 ? 1 : stage === 2 ? 4 : 15 }).map(
        (_, index) => (
          <EmojiScaled key={index} stage={1} />
        )
      )}
    </>
  );
};

export default Emojis;

export const EmojiScaled = ({ stage }: { stage: 1 | 2 | 3 }) => {
  const emoji = useRecoilValue(emojiAtomState);
  const getRandom3QuarterToFull = () => Math.random() / 4 + 3 / 4;
  const randomMinus = Math.random() > 0.5 ? 1 : -1;

  const { width } = useLayoutWidth();

  const EmojiSVG = emoji
    ? emoji.emojiType === "HEART"
      ? Heart
      : emoji.emojiType === "BOOK"
      ? Book
      : emoji.emojiType === "MIRROR_BALL"
      ? MirrorBall
      : Note
    : Note;

  return (
    <motion.div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: stage === 3 ? 140 : 1,
      }}
      initial={{
        x: (randomMinus * width * Math.random()) / 2,
        y: 400 * getRandom3QuarterToFull(),
      }}
      animate={{
        x: (randomMinus * width * Math.random()) / 2,
        y: -2000 * getRandom3QuarterToFull(),

        opacity: Math.random() * 0.9 + 0.1,
      }}
      transition={{ duration: 3 * getRandom3QuarterToFull() }}
    >
      <EmojiSVG animate={{ scale: stage === 1 ? 0.6 : stage * stage * 0.4 }} />
    </motion.div>
  );
};
