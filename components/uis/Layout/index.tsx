import React from "react";
import styled from "@emotion/styled";

interface LayoutProps {
  children: React.ReactNode;
  screenColor?: string; // 모바일 스크린
}

function Layout({ children, screenColor }: LayoutProps) {
  return (
    <StyledContainer>
      <StyledScreen screenColor={screenColor}>{children}</StyledScreen>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: #121212;
  z-index: 100;
  display: flex;
  justify-content: center;
`;

const StyledScreen = styled.div<{ screenColor?: string }>`
  max-width: 450px;
  width: 100%;
  height: 100%;
  background: ${(p) => p.screenColor || "#030303"};
  padding: 0 20px;
  color: #fff;
  position: relative;
`;

export default Layout;
