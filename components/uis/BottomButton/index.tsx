import React from "react";
import styled from "@emotion/styled";

interface BottomButtonProps {
  disabled?: boolean;
  label: string;
  onClick?: () => void;
}

function BottomButton({ ...props }: BottomButtonProps) {
  return <StyledButton {...props}>{props.label}</StyledButton>;
}

const StyledButton = styled.button<{ disabled?: boolean }>`
  cursor: pointer;
  position: sticky;
  bottom: 0;
  background-color: ${(p) => (p.disabled ? "#C6C6C6" : "#007aff")};
  color: #fff;
  min-height: 64px;
  border: none;
  width: 100%;
  font-weight: 800;
  font-size: 18px;
`;

export default BottomButton;
