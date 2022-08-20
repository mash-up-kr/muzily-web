import { motion } from "framer-motion";
import Heart from "~/assets/svgs/Heart";

export const Hearts = ({ stage }: { stage: 1 | 2 | 3 }) => {
  return (
    <>
      {Array.from({ length: stage === 3 ? 15 : 35 }).map((_, index) => (
        <Heart3D key={index} stage={stage} />
      ))}
    </>
  );
};

export const Heart3D = ({ stage }: { stage: 1 | 2 | 3 }) => {
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
      <Heart animate={{ scale: stage === 1 ? 0.6 : stage * stage * 0.4 }} />
    </motion.div>
  );
};
