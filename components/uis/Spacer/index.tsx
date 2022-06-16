import React from "react";
import type { CSSProperties, ReactNode } from "react";
import styled from "@emotion/styled";
import type gaps from "~/theme/emotionTheme/gaps";

interface Props {
  type?: "vertical" | "horizontal";
  gap?: number | keyof typeof gaps;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  children: ReactNode;
}

const Spacer = ({
  type = "vertical",
  gap,
  justify,
  align,
  children,
}: Props) => {
  return (
    <StyledSpacer type={type} gap={gap} align={align} justify={justify}>
      {children}
    </StyledSpacer>
  );
};

const StyledSpacer = styled.div<Props>`
  display: flex;
  flex-direction: ${({ type }) => type === "vertical" && "column"};
  justify-content: ${({ justify }) => justify};
  align-items: ${({ align }) => align};
  gap: ${({ theme, gap = 0 }) =>
    typeof gap === "string" ? theme.gaps[gap] : `${gap}px`};
`;

export default Spacer;
