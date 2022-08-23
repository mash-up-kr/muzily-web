import Lottie from "react-lottie";
import * as blueEqualizerLottieData from "~/assets/lotties/lottie-equalizer-blue.json";
import * as equalizerLottieData from "~/assets/lotties/lottie-equalizer.json";
import type LottieAnimationProps from "./lottie";

interface Props extends LottieAnimationProps {
  color: "blue" | "white";
}

export default function Equalizer({ width, height, isPaused, color }: Props) {
  return (
    <Lottie
      height={width}
      width={height}
      isPaused={isPaused}
      isClickToPauseDisabled
      options={{
        animationData:
          color === "blue" ? blueEqualizerLottieData : equalizerLottieData,
        loop: true,
        autoplay: true,
      }}
    />
  );
}
