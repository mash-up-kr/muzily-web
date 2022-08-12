import type { CSSProperties, ReactNode } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import type gaps from "~/theme/emotionTheme/gaps";

interface Props {
  type?: "vertical" | "horizontal";
  gap?: number | keyof typeof gaps;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  children: ReactNode;
  margin?: number | string;
}

const Spacer = styled(motion.div)<Props>`
  display: flex;
  flex-direction: ${({ type }) => type === "vertical" && "column"};
  justify-content: ${({ justify }) => justify};
  align-items: ${({ align }) => align};
  gap: ${({ theme, gap = 0 }) =>
    typeof gap === "string" ? theme.gaps[gap] : `${gap}px`};
  margin: ${({ margin }) =>
    typeof margin === "string" ? margin : `${margin}px`};
`;

export default Spacer;
