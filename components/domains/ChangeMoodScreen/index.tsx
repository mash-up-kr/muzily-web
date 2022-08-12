import React, { useState } from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import {
  BottomButton,
  Spacer,
  TopBar,
  TopBarIconButton,
} from "~/components/uis";

const MOOD_EXAMPLE = [
  {
    text: "# 조용~ 집중 빡 공부 모드",
    iconName: "book-3d",
  },
  {
    text: "# 쉣댓 부레 엉덩이~! 흔들어버려",
    iconName: "mirror-3d",
  },
  {
    text: "# 잔잔한 내적 댄스 유발",
    iconName: "heart-3d",
  },
];

interface ChangeMoodScreenProps {
  onClickBackButton: () => void;
  onClosePrevPage: () => void;
}

const ChangeMoodScreen = ({
  onClickBackButton,
  onClosePrevPage,
}: ChangeMoodScreenProps) => {
  const [mood, setMood] = useState("");

  const handleClick = () => {
    onClickBackButton();
    onClosePrevPage();
  };

  return (
    <S.Container>
      <TopBar
        leftIconButton={
          <TopBarIconButton iconName="arrow-left" onClick={onClickBackButton} />
        }
      >
        무드 변경
      </TopBar>
      <S.Title>
        <Image src={`/images/ticket.svg`} alt="icon" width={118} height={38} />
        &nbsp; 의&nbsp;무드는?
      </S.Title>
      <S.SubTitle>무드에 맞춘 이모지를 제공해드려요!</S.SubTitle>
      <S.ButtonGroup type="vertical" gap={15}>
        {MOOD_EXAMPLE.map((v) => (
          <S.Button
            key={v.text}
            onClick={() => setMood(v.iconName)}
            isActive={mood === v.iconName}
          >
            <S.ButtonText>{v.text}</S.ButtonText>
            <Image
              src={`/images/${v.iconName}.svg`}
              alt="icon"
              width={56}
              height={58}
            />
          </S.Button>
        ))}
      </S.ButtonGroup>
      <S.NoticeTextWrapper gap={4}>
        <S.BottomButton>
          직접 입력&nbsp;
          <Image src={`/images/plus.svg`} alt="icon" width={14} height={14} />
        </S.BottomButton>
      </S.NoticeTextWrapper>
      <BottomButton label="무드 변경하기" onClick={handleClick} />
    </S.Container>
  );
};

const S = {
  Container: styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #fff;
    text-align: left;
    background: linear-gradient(#000, 85%, #01356e);
    padding: 0 20px;
    z-index: 1;
  `,
  Title: styled.h3`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 111px;
    font-size: 18px;
  `,
  SubTitle: styled.p`
    margin-top: 17px;
    font-size: 16px;
    text-align: center;
    color: #8b95a1;
  `,
  ButtonGroup: styled(Spacer)`
    width: 100%;
    margin-top: 35px;
  `,
  Button: styled.button<{ isActive: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 22px;
    border: none;
    background: ${(p) => (p.isActive ? "white" : "rgba(64, 73, 83, 0.85)")};
    color: ${(p) => (p.isActive ? "#007AFF" : "white")};
    border-radius: 20px;
  `,
  ButtonText: styled.p`
    font-size: 16px;
    font-weight: 700;
  `,
  NoticeTextWrapper: styled(Spacer)`
    position: absolute;
    bottom: 32px;
    align-items: flex-start;
  `,
  BottomButton: styled.button`
    display: flex;
    align-items: center;
    font-size: 16px;
    color: white;
    background-color: transparent;
    border: none;
  `,
};

export default ChangeMoodScreen;
