import React from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

interface Props extends React.ComponentProps<typeof motion.div> {
  type?: "round";
  iconName: string; // 파일명에서 .svg를 제거한 파일명
  onClick?: () => void;
}

function IconButton({ type = "round", iconName, onClick, ...props }: Props) {
  const extension = ".svg";

  return (
    <StyledContainer {...props} onClick={onClick}>
      <StyledIconWrapper style={{ pointerEvents: "none" }}>
        <Image
          src={`/images/${iconName}${extension}`}
          alt="icon"
          width={20}
          height={20}
        />
      </StyledIconWrapper>
    </StyledContainer>
  );
}

const StyledContainer = styled(motion.div)`
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
  background: rgba(255, 255, 255, 0.1);

  display: flex;
  justify-content: center;
  align-items: center;
`;

export default IconButton;
