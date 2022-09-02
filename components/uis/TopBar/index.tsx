import type { ReactNode, CSSProperties } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Spacer from "../Spacer";

interface Props {
  leftIconButton?: JSX.Element;
  rightIconButton?: JSX.Element;
  children?: ReactNode;
  sticky?: boolean;
  backgroundColor?: CSSProperties["backgroundColor"];
}
const TopBar = ({
  leftIconButton,
  rightIconButton,
  children,
  sticky = true,
  backgroundColor = "transparent",
}: Props) => {
  return (
    <div
      css={css`
        ${sticky &&
        css`
          position: sticky;
          top: 0;
          z-index: 5;
        `}
        padding: 16px;
        color: #fff;
        background: linear-gradient(
          ${backgroundColor},
          ${backgroundColor},
          ${backgroundColor},
          transparent
        );
      `}
    >
      <Spacer type="horizontal" justify="space-between" align="center">
        <IconWrapper>{leftIconButton}</IconWrapper>
        <h2
          css={css`
            flex: 1;
            width: 100%;
            line-height: 1;
            text-align: center;
            font-size: 16px;
            position: absolute;
            left: 0;
            right: 0;
            pointer-events: none;
          `}
        >
          {children}
        </h2>
        <IconWrapper>{rightIconButton}</IconWrapper>
      </Spacer>
    </div>
  );
};

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default TopBar;
