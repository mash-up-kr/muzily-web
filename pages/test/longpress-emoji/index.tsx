import { motion } from "framer-motion";
import { LongPressCancelable } from "~/components/domains";

const LongPressEmojiTestPage = () => {
  return (
    <LongPressCancelable
      trigger={({ register, isProcessing, percentage }) => (
        <motion.button
          {...register}
          initial={{ scale: 1 }}
          animate={isProcessing ? { scale: 1.9 } : { scale: 1 }}
          transition={{
            duration: isProcessing ? 4 : 0.1,
            ease: isProcessing ? "easeInOut" : "easeOut",
          }}
        >
          emoji isAnimating: {isProcessing ? "true" : "false"} , percentage:
          {percentage}%
        </motion.button>
      )}
      onFire={async ({ percentage }) => {
        console.log(`emoji api call emoji power ${percentage}%`);
      }}
      onTooLongPressed={async () => {
        console.log("tooLongPressed emoji canceled");
      }}
    />
  );
};

export default LongPressEmojiTestPage;
