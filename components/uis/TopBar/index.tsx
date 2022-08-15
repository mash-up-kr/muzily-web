import type { ReactNode } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

interface Props {
  leftIconButton?: JSX.Element;
  rightIconButton?: JSX.Element;
  children?: ReactNode;
  sticky?: boolean;
}
const TopBar = ({
  leftIconButton,
  rightIconButton,
  children,
  sticky = true,
}: Props) => {
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
  display: flex;
  justify-content: center;
  align-items: center;
`;
const RightIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const StyledContainer = styled.div<{ sticky?: boolean }>`
  ${(p) =>
    p.sticky &&
    css`
      position: sticky;
      top: 0;
      z-index: 5;
    `}
  padding: 16px;
  background-color: black;
  display: flex;
  align-items: center;
  height: 60px;
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
