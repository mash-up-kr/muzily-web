import React from "react";
import { css, ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import { Layout, Spacer, Toast } from "~/components/uis";
import ToastCreator from "~/libs/Toast";
import { emotionTheme } from "~/theme";

const ToastDefault = new ToastCreator({
  Adapter: ({ children }) => (
    <ThemeProvider theme={emotionTheme}>{children}</ThemeProvider>
  ),
});

const ToastTestPage = () => {
  return (
    <Layout screenColor="#121212">
      <Spacer
        type="vertical"
        gap={16}
        style={{ marginTop: 32, padding: "0 16px" }}
      >
        <S.Button
          onClick={() => {
            // 1. ReactElement를 넘길 수도 있고,
            Toast.show(<Spacer justify="space-between">토스트 짜잔~!</Spacer>);
          }}
        >
          기본 시간 toast
        </S.Button>
        <S.Button
          onClick={() => {
            // 2. 함수를 넘겨서 options, close, closeAll를 사용할 수도 있어요
            Toast.show(
              ({ options, close, closeAll }) => (
                <Spacer justify="space-between" align="center">
                  토스트 짜잔~! ({options.duration / 1000}초)
                  <Spacer gap={8}>
                    <S.Button onClick={close}>닫기</S.Button>
                    <S.Button onClick={closeAll}>모두 닫기</S.Button>
                  </Spacer>
                </Spacer>
              ),
              // 3. options에 status를 넣어 Toast 인스턴스를 생성할 때 정의한 Template에 전달해 status에 따라 다른 토스트가 노출되도록 만들 수 있어요.
              { duration: 8000, delay: 300, status: "error" }
            );
          }}
        >
          8초 Error open toast
        </S.Button>
        <S.Button
          onClick={() => {
            Toast.show(
              ({ options, close, closeAll }) => (
                <Spacer justify="space-between" align="center">
                  토스트 짜잔~! ({options.duration / 1000}초)
                  <Spacer gap={8}>
                    <S.Button onClick={close}>닫기</S.Button>
                    <S.Button onClick={closeAll}>모두 닫기</S.Button>
                  </Spacer>
                </Spacer>
              ),
              { duration: 1000, delay: 300, status: "success" }
            );
          }}
        >
          1초 Success toast
        </S.Button>
        <S.Button
          onClick={() => {
            Toast.show(
              ({ options, close, closeAll }) => (
                <Spacer justify="space-between" align="center">
                  토스트 짜잔~! ({options.duration / 1000}초)
                  <Spacer gap={8}>
                    <S.Button onClick={close}>닫기</S.Button>
                    <S.Button onClick={closeAll}>모두 닫기</S.Button>
                  </Spacer>
                </Spacer>
              ),
              { duration: 4000, delay: 300, status: "warning" }
            );
          }}
        >
          4초 Warning toast
        </S.Button>
        <S.Button
          onClick={() => {
            ToastDefault.show(
              ({ options }) => (
                <Spacer justify="space-between">
                  토스트 짜잔~! ({options.duration / 1000}초)
                </Spacer>
              ),
              { duration: 2000 }
            );
          }}
        >
          2초 toast
        </S.Button>
      </Spacer>
    </Layout>
  );
};

export default ToastTestPage;

const S = {
  Button: styled.button`
    ${({ theme }) => css`
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      background-color: ${theme.colors.blue0500};
      height: 40px;
      padding: 18px;
      border-radius: 12px;
      border: none;
      cursor: pointer;

      &:hover {
        opacity: 0.85;
      }

      &:disabled {
        cursor: not-allowed;
        filter: contrast(0.8);
      }

      transition: 0.2s opacity;
    `}
  `,
};
