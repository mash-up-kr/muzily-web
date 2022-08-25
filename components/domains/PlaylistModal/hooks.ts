import { useEffect } from "react";
import type { MotionValue } from "framer-motion";
import { animate, useMotionValue } from "framer-motion";

const inactiveShadow = "0px 0px 0px rgba(0,0,0,0.8)";

export const useRaisedShadow = (value: MotionValue<number>) => {
  const boxShadow = useMotionValue(inactiveShadow);

  useEffect(() => {
    let isActive = false;
    value.onChange((latest) => {
      const wasActive = isActive;
      if (latest !== 0) {
        isActive = true;
        if (isActive !== wasActive) {
          animate(boxShadow, "0px 5px 10px rgba(0,0,0,0.1)");
        }
      } else {
        isActive = false;
        if (isActive !== wasActive) {
          animate(boxShadow, inactiveShadow);
        }
      }
    });
  }, [value, boxShadow]);

  return boxShadow;
};
