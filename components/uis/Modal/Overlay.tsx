import type { CSSProperties } from "react";
import React from "react";
import { useModal } from "./context";

type Props = {
  color?: string;
  disableCloseOnClick?: boolean;
} & { style?: Omit<CSSProperties, keyof typeof defaultStyle> };

const defaultStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
} as const;

const Overlay = ({ color, disableCloseOnClick, style }: Props) => {
  const { close } = useModal();

  return (
    <div
      {...(disableCloseOnClick ? {} : { onClick: close })}
      style={{
        ...style,
        ...defaultStyle,
        backgroundColor: color ?? "rgba(0,0,0,0.6)",
      }}
    />
  );
};

export default Overlay;
