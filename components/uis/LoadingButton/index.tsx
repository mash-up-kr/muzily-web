import type { ComponentProps } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Spacer from "../Spacer";

const LoadingButton = ({
  loading = false,
  children,
  ...props
}: ComponentProps<typeof S.Button> & { loading?: boolean }) => {
  return (
    <S.Button {...props}>
      <Spacer gap={8} align="center">
        {loading && <S.Spinner />}
        {children}
      </Spacer>
    </S.Button>
  );
};

export default LoadingButton;
const S = {
  Spinner: styled.div`
    ${({ theme }) => css`
      border: 3px solid ${theme.colors.blue0100};
      border-top: 3px solid ${theme.colors.blue0200};
      border-radius: 50%;
      width: 18px;
      height: 18px;
      animation: spin 1s linear infinite;

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}
  `,

  Button: styled.button`
    ${({ theme }) => css`
      border-radius: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      background-color: ${theme.colors.blue0500};
      font-size: 18px;
      padding: 12px 24px;
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
