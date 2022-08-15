import type { ReactNode } from "react";
import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Layout, Spacer, Toast } from "~/components/uis";

const ToastTestPage = () => {
  const handleSomething = () => {
    console.log("something");
  };

  return (
    <Layout screenColor="#121212">
      <Spacer type="vertical" gap={16} style={{ marginTop: 32 }}>
        <S.Button
          onClick={() => {
            // 1. ReactElement를 넘길 수도 있고,
            Toast.show(
              <ToastContent onClick={handleSomething}>
                토스트 짜잔~!
              </ToastContent>
            );
          }}
        >
          open modal
        </S.Button>
        <S.Button
          onClick={() => {
            // 2. 함수를 넘겨서 options를 사용할 수도 있어요,
            Toast.show(({ options }) => (
              <ToastContent onClick={handleSomething} options={options}>
                토스트 짜잔~!
              </ToastContent>
            ));
          }}
        >
          open modal
        </S.Button>
      </Spacer>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
      <BigText>안녕하세요 뒤의 내용입니다.</BigText>
    </Layout>
  );
};

export default ToastTestPage;

const ToastContent = (props: {
  onClick: () => void;
  options?: any;
  children?: ReactNode;
}) => {
  return (
    <Spacer justify="space-between" style={{ color: "white" }}>
      {props.children}
      <S.Button onClick={props.onClick}>something</S.Button>
    </Spacer>
  );
};

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
      border-radius: 16px;
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

const BigText = styled.div`
  font-size: 30px;
`;
