import React, { useState } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import {
  BottomButton,
  Layout,
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

const RoomCreateMoodPage: NextPage = () => {
  const [mood, setMood] = useState(
    {} as {
      name: string;
      emoji: string;
    }
  );
  const router = useRouter();

  return (
    <Layout screenColor="linear-gradient(#000, 85%, #01356E)">
      <TopBar leftIconButton={<TopBarIconButton iconName="arrow-left" />}>
        방 만들기
      </TopBar>
      <StyledContainer>
        <StyledTitle>
          <Image
            src={`/images/ticket.svg`}
            alt="icon"
            width={118}
            height={38}
          />
          &nbsp; 의&nbsp;무드는?
        </StyledTitle>
        <StyledSubTitle>무드에 맞춘 이모지를 제공해드려요!</StyledSubTitle>
        <StyledButtonGroup type="vertical" gap={15}>
          {MOOD_EXAMPLE.map((v) => (
            <StyledButton
              key={v.text}
              onClick={() => setMood({ name: v.text, emoji: v.iconName })}
              isActive={mood.emoji === v.iconName}
            >
              <StyledButtonText>{v.text}</StyledButtonText>
              <Image
                src={`/images/${v.iconName}.svg`}
                alt="icon"
                width={56}
                height={58}
              />
            </StyledButton>
          ))}
        </StyledButtonGroup>
        <StyledNoticeTextWrapper gap={4}>
          <StyledBottomButton>
            직접 입력&nbsp;
            <Image src={`/images/plus.svg`} alt="icon" width={14} height={14} />
          </StyledBottomButton>
        </StyledNoticeTextWrapper>
      </StyledContainer>
      <BottomButton label="다음" onClick={() => console.log("next!")} />
    </Layout>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  height: calc(100% - 104px);
  padding: 20px 0;
`;

const StyledTitle = styled.h3`
  display: flex;
  align-items: center;
  font-size: 18px;
`;

const StyledSubTitle = styled.p`
  margin-top: 17px;
  font-size: 16px;
  color: #8b95a1;
`;

const StyledButtonGroup = styled(Spacer)`
  width: 100%;
  margin-top: 35px;
`;

const StyledButton = styled.button<{ isActive: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 22px;
  border: none;
  background: ${(p) => (p.isActive ? "white" : "rgba(64, 73, 83, 0.85)")};
  color: ${(p) => (p.isActive ? "#007AFF" : "white")};
  border-radius: 20px;
`;

const StyledButtonText = styled.p`
  font-size: 16px;
  font-weight: 700;
`;

const StyledNoticeTextWrapper = styled(Spacer)`
  position: absolute;
  bottom: 32px;
  align-items: flex-start;
`;

const StyledBottomButton = styled.button`
  display: flex;
  align-items: center;
  font-size: 16px;
  color: white;
  background-color: transparent;
  border: none;
`;

export default RoomCreateMoodPage;
