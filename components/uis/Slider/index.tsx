import type { FC, ComponentProps } from "react";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import styled from "@emotion/styled";

interface Props {
  min?: Props["defaultValue"];
  max?: Props["defaultValue"];
  step?: number;
  defaultValue?: number;
  name?: string;
  onChange: (name: string, newValue: number) => void;
  onTapEnd?: (e: MouseEvent | TouchEvent) => void;
  handle?: FC<ComponentProps<typeof DefaultHandle>>;
}

const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue,
  name = "slider",
  onChange,
  onTapEnd,
  handle,
}: Props) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [value, setValue] = useState(defaultValue || min);

  const handleResizeWindow = useCallback(() => setIsResizing(true), []);

  const handleMouseDown = useCallback(() => {
    setDragging(true);
  }, []);

  const handleMouseUp = useCallback<(e: MouseEvent) => void>(
    (e) => {
      setDragging(false);
      onTapEnd?.(e);
    },
    [onTapEnd]
  );

  const handleTouchUp = useCallback<(e: TouchEvent) => void>(
    (e) => {
      setDragging(false);
      onTapEnd?.(e);
    },
    [onTapEnd]
  );

  const sliderLeft = useMemo(() => {
    setIsResizing(false);

    return sliderRef.current?.getBoundingClientRect().x;
  }, [sliderRef.current, isResizing]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) {
        return;
      }
      let handleOffset = 0;
      if (e instanceof MouseEvent) {
        handleOffset = e.pageX - (sliderLeft || 0);
      }
      if (e instanceof TouchEvent) {
        handleOffset = e.changedTouches[0].pageX - (sliderLeft || 0);
      }
      const sliderWidth = sliderRef.current?.offsetWidth;

      const track = handleOffset / (sliderWidth || 0);
      let newValue;
      if (track < 0) {
        newValue = min;
      } else if (track > 1) {
        newValue = max;
      } else {
        newValue = Math.round((min + (max - min) * track) / step) * step;
        newValue = Math.min(max, Math.max(min, newValue));
      }

      setValue(newValue);
      onChange(name, newValue);
    };

    window.addEventListener("resize", handleResizeWindow);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleMouseMove);
    document.addEventListener("touchend", handleTouchUp);

    return () => {
      window.removeEventListener("resize", handleResizeWindow);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("touchend", handleTouchUp);
    };
  }, [
    value,
    min,
    max,
    dragging,
    sliderRef,
    handleMouseUp,
    onChange,
    step,
    name,
  ]);

  const Handle = handle || DefaultHandle;

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <SliderContainer ref={sliderRef}>
      <Rail />
      <Track style={{ width: `${percentage}%` }} />
      <Handle
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{ left: `${percentage}%` }}
      />
    </SliderContainer>
  );
};
const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 24px;
`;

const Rail = styled.div`
  position: absolute;
  top: 10px;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.gray0200};
`;

const DefaultHandle = styled.div`
  position: absolute;
  top: 12px;
  left: 0;
  width: 16px;
  height: 16px;
  transform: translate(-50%, -50%);
  border: 2px solid ${({ theme }) => theme.colors.gray0900};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.white};
  cursor: grab;
`;

const Track = styled.div`
  position: absolute;
  top: 10px;
  left: 0;
  width: 0;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.gray0900};
`;

export default Slider;
