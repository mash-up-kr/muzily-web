import React from "react";
import { css } from "@emotion/react";
import Spacer from "../Spacer";
import Spinner from "../Spinner";

interface BottomButtonProps {
  loading?: boolean;
  disabled?: boolean;
  label: string;
  onClick?: () => void;
}

function BottomButton({ loading, ...props }: BottomButtonProps) {
  return (
    <button
      {...props}
      css={css`
        cursor: pointer;
        position: fixed;
        bottom: 0;
        background-color: #007aff;
        color: #fff;
        min-height: 64px;
        border: none;
        width: 100%;
        font-weight: 800;
        font-size: 18px;

        &:hover {
          opacity: 0.85;
        }

        &:disabled {
          cursor: not-allowed;
          filter: contrast(0.8);
        }
      `}
    >
      <Spacer type="horizontal" align="center" justify="center" gap={8}>
        {loading && <Spinner />}
        {props.label}
      </Spacer>
    </button>
  );
}

export default BottomButton;
