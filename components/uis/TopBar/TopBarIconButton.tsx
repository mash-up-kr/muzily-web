import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "@emotion/styled";

interface TopBarIconButtonProps {
  iconName: string; // 파일명에서 .svg
  alt?: string;
  onClick?: () => void;
  boxSize?: number;
}
const TopBarIconButton = ({
  iconName,
  alt,
  onClick,
  boxSize,
}: TopBarIconButtonProps) => {
  const router = useRouter();
  const backButton = () => {
    if (iconName === "arrow-left") {
      router.back();
    } else if (iconName === "logo") {
      router.push("/");
    }
  };

  return (
    <StyledIconWrapper onClick={onClick ?? backButton}>
      <Image
        src={`/images/${iconName}.svg`}
        alt={alt ?? "icon"}
        width={boxSize ?? 24}
        height={boxSize ?? 24}
      />
    </StyledIconWrapper>
  );
};

const StyledIconWrapper = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
`;

export default TopBarIconButton;
