import React from "react";
import styled from "@emotion/styled";

interface BottomButtonProps {
  disabled?: boolean;
  label: string;
  onClick?: () => void;
}

function BottomButton({ disabled = false, label, onClick }: BottomButtonProps) {
  return (
    <StyledButton disabled={disabled} onClick={() => !disabled && onClick?.()}>
      {label}
    </StyledButton>
  );
}

const StyledButton = styled.button<{ disabled?: boolean }>`
  cursor: pointer;
  position: sticky;
  top: 100%;
  background-color: ${(p) => (p.disabled ? "#C6C6C6" : "#007aff")};
  color: #fff;
  height: 64px;
  border: none;

  width: calc(100% + 40px);
  margin-left: -20px;

  font-weight: 800;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: -0.450631px;
`;

export default BottomButton;
