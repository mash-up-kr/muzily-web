import React from "react";
import Image from "next/image";
import styled from "@emotion/styled";

interface TopBarIconButtonProps {
  iconName: string; // 파일명에서 .svg
  alt?: string;
  onClick?: () => void;
}
const TopBarIconButton = ({
  iconName,
  alt,
  onClick,
}: TopBarIconButtonProps) => {
  return (
    <StyledIconWrapper onClick={onClick}>
      <Image
        src={`/images/${iconName}.svg`}
        alt={alt ?? "icon"}
        width={24}
        height={24}
      />
    </StyledIconWrapper>
  );
};

const StyledIconWrapper = styled.button`
  cursor: pointer;
  width: 24px;
  height: 24px;
  background-color: transparent;
  border: none;
  padding: 0;
`;

export default TopBarIconButton;
