import React from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

interface Props extends React.ComponentProps<typeof motion.div> {
  type?: "round";
  iconName: string; // 파일명에서 .svg를 제거한 파일명
  onClick?: () => void;
  badgeValue?: number;
}

function IconButton({
  type = "round",
  badgeValue,
  iconName,
  onClick,
  ...props
}: Props) {
  const extension = ".svg";

  return (
    <S.Container {...props} onClick={onClick}>
      <S.IconWrapper style={{ pointerEvents: "none" }}>
        <Image
          src={`/images/${iconName}${extension}`}
          alt="icon"
          width={20}
          height={20}
        />
      </S.IconWrapper>
      {badgeValue ? <S.Badge>{badgeValue}</S.Badge> : <></>}
    </S.Container>
  );
}

const S = {
  Container: styled(motion.div)`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  `,

  IconWrapper: styled.div`
    cursor: pointer;

    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);

    display: flex;
    justify-content: center;
    align-items: center;
  `,

  Badge: styled.div`
    width: 24px;
    height: 24px;
    background: #017aff;
    color: #fff;
    border-radius: 50%;

    font-weight: 600;
    font-size: 12px;
    line-height: 155%;
    letter-spacing: -0.498081px;

    position: absolute;
    top: -5px;
    right: -5px;

    display: grid;
    place-items: center;
  `,
};

export default IconButton;
