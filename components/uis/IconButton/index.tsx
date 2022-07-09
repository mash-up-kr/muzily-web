import React from "react";
import Image from "next/image";
import styled from "@emotion/styled";

interface IconButtonProps {
  type?: "round";
  iconName: string; // 파일명에서 .svg
  iconText?: string;
}

function IconButton({ type = "round", iconName, iconText }: IconButtonProps) {
  return (
    <StyledContainer>
      <StyledIconWrapper>
        <Image
          src={`/images/${iconName}.svg`}
          alt="icon"
          width={20}
          height={20}
        />
      </StyledIconWrapper>
      {iconText && <StyledIconText>{iconText}</StyledIconText>}
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const StyledIconWrapper = styled.div`
  cursor: pointer;

  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(136, 109, 109, 0.1);

  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledIconText = styled.span`
  font-weight: 600;
  font-size: 14px;
  line-height: 155%;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.498081px;
`;

export default IconButton;
