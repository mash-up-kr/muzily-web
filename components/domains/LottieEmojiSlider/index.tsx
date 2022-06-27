import type { ComponentProps } from "react";
import React, { createContext, useContext } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { AnimatePresence } from "framer-motion";
import Lottie from "react-lottie-player";
import animationData from "~/assets/smile.json";
import { Slider, Spacer } from "~/components/uis";

const EmojiSliderContext = createContext({} as { segment: number });
const useEmojiSliderContext = () => useContext(EmojiSliderContext);

const MIN_SEGMENT = 10;
const MAX_SEGMENT = 51;

interface Props {
  trigger: React.FC<{ show: () => void }>;
  onTapEnd?: (e: MouseEvent | TouchEvent) => Promise<void> | void;
}

const LottieEmojiSlider = ({ trigger, onTapEnd }: Props) => {
  const [isShow, setIsShow] = React.useState(false);
  const [segment, setSegment] = React.useState(0);

  const show = () => setIsShow(true);

  return (
    <EmojiSliderContext.Provider value={{ segment }}>
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
                handle={CustomHandle}
                defaultValue={Math.abs((MIN_SEGMENT + MAX_SEGMENT) / 2)}
                min={MIN_SEGMENT}
                max={MAX_SEGMENT}
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
    </EmojiSliderContext.Provider>
  );
};

export default LottieEmojiSlider;

const CustomHandle = (
  props: Parameters<NonNullable<ComponentProps<typeof Slider>["handle"]>>[0]
) => {
  const { segment } = useEmojiSliderContext();

  return (
    <Handle {...props}>
      <Lottie
        animationData={animationData}
        goTo={segment}
        style={{ width: 150, height: 150 }}
      />
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
