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
    max-height: 100%;
    z-index: 100;
    display: flex;
    justify-content: center;
  `,

  Screen: styled.div<{ screenColor?: string }>`
    max-width: 450px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background: ${(p) => p.screenColor};
    color: #fff;
    position: relative;
    backdrop-filter: blur(10px);

    ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  `,
};

export default Layout;
