import type { ComponentProps, CSSProperties } from "react";
import React, { createContext, useContext } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { AnimatePresence } from "framer-motion";
import Lottie from "react-lottie-player";
import { Slider, Spacer } from "~/components/uis";

const SliderContext = createContext({} as { segment: number });
const useSliderContext = () => useContext(SliderContext);

const SEGMENT_MIN = 10;
const SEGMENT_MAX = 51;
const SEGMENT_AVERAGE = Math.abs((SEGMENT_MIN + SEGMENT_MAX) / 2);

type LottieAnimationData = object;
interface Props {
  customHandle: ReturnType<typeof makeCustomHandle>;
  trigger: React.FC<{ show: () => void }>;
  onTapEnd?: (e: MouseEvent | TouchEvent) => Promise<void> | void;
}

const LottieSlider = ({ customHandle, trigger, onTapEnd }: Props) => {
  const [isShow, setIsShow] = React.useState(false);
  const [segment, setSegment] = React.useState(0);

  const show = () => {
    setSegment(SEGMENT_AVERAGE);
    setIsShow(true);
  };

  return (
    <SliderContext.Provider value={{ segment }}>
      {trigger({ show })}
      <AnimatePresence>
        {isShow && (
          <S.SpacerContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            type="vertical"
            justify="center"
            align="center"
          >
            <S.Backdrop />
            <S.SliderWrapper>
              <Slider
                handle={customHandle}
                defaultValue={SEGMENT_AVERAGE}
                min={SEGMENT_MIN}
                max={SEGMENT_MAX}
                onChange={(name, newValue) => setSegment(newValue)}
                onTapEnd={async (e) => {
                  await onTapEnd?.(e);
                  setIsShow(false);
                }}
              />
            </S.SliderWrapper>
          </S.SpacerContainer>
        )}
      </AnimatePresence>
    </SliderContext.Provider>
  );
};

interface MakeCustomHandleProps {
  animationData: LottieAnimationData;
  style?: CSSProperties;
}

const makeCustomHandle =
  ({
    animationData,
    style = { width: 150, height: 150 },
  }: MakeCustomHandleProps) =>
  (
    props: Parameters<NonNullable<ComponentProps<typeof Slider>["handle"]>>[0]
  ) => {
    const { segment } = useSliderContext();

    return (
      <Handle {...props}>
        <Lottie animationData={animationData} goTo={segment} style={style} />
      </Handle>
    );
  };

const S = {
  SpacerContainer: styled(Spacer)`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  `,
  Backdrop: styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    ${({ theme }) => css`
      background: ${theme.colors.black};
      opacity: 0.3;
    `}
  `,
  SliderWrapper: styled.div`
    width: 100%;
    padding: 0 16px;
  `,
};

const Handle = styled.div`
  position: absolute;
  top: 12px;
  left: 0;
  transform: translate(-50%, -50%);
  cursor: grab;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default LottieSlider;

LottieSlider.makeCustomHandle = makeCustomHandle;
