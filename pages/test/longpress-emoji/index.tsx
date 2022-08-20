import { motion } from "framer-motion";
import { LongPress } from "~/components/uis";

const LongPressEmojiTestPage = () => {
  return (
    <LongPress
      threshold={10000}
      trigger={({ register, isProcessing, percentage }) => (
        <motion.button
          {...register()}
          initial={{ scale: 1, rotate: 0 }}
          animate={
            isProcessing
              ? percentage >= 80
                ? {
                    scale: 2.2,
                    rotate: [
                      0, 5, 5, -5, -5, 5, 5, -5, -5, 5, 5, -5, -5, 5, -5, 5, -5,
                      5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5,
                      -5, 5, -5, 0,
                    ],
                  }
                : { scale: 2.9 }
              : { scale: 1 }
          }
          transition={{
            duration: isProcessing ? 4 : 0.1,
            ease: isProcessing ? "easeInOut" : "easeOut",
          }}
          style={{ padding: 16, userSelect: "none" }}
        >
          <p>isAnimating: {isProcessing ? "true" : "false"}</p>
          <p>percentage:{percentage}%</p>
        </motion.button>
      )}
      onPressOut={({ percentage }) => {
        console.log(`emoji api call emoji power ${percentage}%`);
      }}
      onTooLongPress={async () => {
        console.log("tooLongPressed emoji canceled");
      }}
    />
  );
};

export default LongPressEmojiTestPage;
