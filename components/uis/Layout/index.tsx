import React from "react";
import styled from "@emotion/styled";

interface Props {
  children: React.ReactNode;
  screenColor?: string;
}

function Layout({ children, screenColor = "#030303" }: Props) {
  return (
    <S.Container>
      <S.Screen screenColor={screenColor}>{children}</S.Screen>
    </S.Container>
  );
}

const S = {
  Container: styled.div`
    height: 100%;
    width: 100%;
    background-color: #121212;
    z-index: 100;
    display: flex;
    justify-content: center;
  `,

  Screen: styled.div<{ screenColor?: string }>`
    max-width: 450px;
    width: 100%;
    height: 100%;
    background: ${(p) => p.screenColor};
    padding: 0 20px;
    color: #fff;
    position: relative;
  `,
};

export default Layout;
