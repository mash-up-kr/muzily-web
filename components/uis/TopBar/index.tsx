import type { ReactNode } from "react";
import styled from "@emotion/styled";

interface TopBarProps {
  leftIconButton?: JSX.Element;
  rightIconButton?: JSX.Element;
  children?: ReactNode;
}
const TopBar = ({ leftIconButton, rightIconButton, children }: TopBarProps) => {
  return (
    <StyledContainer>
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
const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 24px;
`;
const StyledTopBarText = styled.h2`
  flex: 1;
  width: 100%;
  line-height: 1;
  text-align: center;
  font-size: 16px;
`;

export default TopBar;
