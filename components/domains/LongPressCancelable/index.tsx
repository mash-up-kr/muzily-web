import type { ReactElement } from "react";
import React, { useState, useRef } from "react";
import { useLongPress, useDisclosure, useIntervalFn } from "~/hooks/commons";

interface Props {
  trigger: (args: {
    isProcessing: boolean;
    register: ReturnType<ReturnType<typeof useLongPress>>;
    percentage: number;
  }) => ReactElement;
  onFire: (args: { percentage: number }) => Promise<void> | void;
  onTooLongPressed: () => Promise<void> | void;
  threshold?: number;
}

const LongPressCancelable = ({
  trigger,
  onFire,
  onTooLongPressed,
  threshold = 3000,
}: Props) => {
  const isValid = useRef(true);
  const [percentage, setState] = useState(0);

  const [run, clear] = useIntervalFn(() => {
    setState((prev) => prev + 1);
  }, threshold / 100);

  const {
    isOpen: isProcessing,
    open: start,
    close: terminate,
  } = useDisclosure({
    initialState: false,
    onOpen: run,
    onClose: () => {
      clear();
      setState(0);
    },
  });

  const register = useLongPress(
    async () => {
      isValid.current = false;
      terminate();
      await onTooLongPressed?.();
    },
    {
      threshold,
      onStart: () => {
        console.log("started");
        isValid.current = true;
        start();
      },
      onCancel: async () => {
        await onFire({ percentage });
        terminate();
      },
    }
  );

  return (
    <>
      {trigger({
        isProcessing,
        register: register(),
        percentage,
      })}
    </>
  );
};

export default LongPressCancelable;
