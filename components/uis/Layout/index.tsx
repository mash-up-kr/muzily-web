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
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: grey;
`;

const StyledScreen = styled.div<{ screenColor?: string }>`
  min-width: 375px;
  max-width: 450px;
  height: 100vh;
  background-color: ${(p) => p.screenColor || "#030303"};
  padding: 0 20px;
  color: #fff;
`;

export default Layout;
