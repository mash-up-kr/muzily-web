import type { ReactElement } from "react";
import { useState } from "react";
import { useLongPress, useDisclosure, useIntervalFn } from "~/hooks/commons";

interface Props {
  trigger: (args: {
    isProcessing: boolean;
    register: ReturnType<typeof useLongPress<Element>>;
    percentage: number;
  }) => ReactElement;
  onPressOut?: (args: { percentage: number }) => void;
  onTooLongPress?: () => Promise<void> | void;
  threshold?: number;
}

const LongPress = ({
  trigger,
  onPressOut,
  onTooLongPress,
  threshold = 3000,
}: Props) => {
  const [percentage, setPercentage] = useState(0);

  const [run, clear] = useIntervalFn(() => {
    setPercentage((prev) => prev + 1);
  }, threshold / 100);

  const {
    isOpen: isProcessing,
    open: start,
    close: terminate,
  } = useDisclosure({
    initialState: false,
    onOpen: run,
    onClose: clear,
  });

  const register = useLongPress(
    // longpress 된 경우, tooLongPress
    () => {
      terminate();
      onTooLongPress?.();
      setPercentage(0);
    },
    {
      threshold,
      onStart: (event, meta) => {
        start();
      },
      // longpress 실패한 경우, onPressOut
      onCancel: (event, meta) => {
        terminate();

        if (percentage) {
          onPressOut?.({ percentage });
        }
        setPercentage(0);
      },
    }
  );

  return trigger({
    isProcessing,
    register,
    percentage,
  });
};

export default LongPress;
