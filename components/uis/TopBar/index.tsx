import type { ReactNode } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

interface TopBarProps {
  leftIconButton?: JSX.Element;
  rightIconButton?: JSX.Element;
  children?: ReactNode;
  sticky?: boolean;
}
const TopBar = ({
  leftIconButton,
  rightIconButton,
  children,
  sticky,
}: TopBarProps) => {
  return (
    <StyledContainer sticky={sticky}>
      {leftIconButton && <LeftIconWrapper>{leftIconButton}</LeftIconWrapper>}
      <StyledTopBarText>{children}</StyledTopBarText>
      {rightIconButton && (
        <RightIconWrapper>{rightIconButton}</RightIconWrapper>
      )}
    </StyledContainer>
  );
};

const LeftIconWrapper = styled.div`
  margin-left: -24px;
`;
const RightIconWrapper = styled.div`
  margin-right: -24px;
`;
const StyledContainer = styled.div<{ sticky?: boolean }>`
  ${(p) =>
    p.sticky &&
    css`
      position: sticky;
      top: 0;
      z-index: 5;
    `}
  background-color: #030303;
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 24px;
  color: #fff;
`;
const StyledTopBarText = styled.h2`
  flex: 1;
  width: 100%;
  line-height: 1;
  text-align: center;
  font-size: 16px;
`;

export default TopBar;
