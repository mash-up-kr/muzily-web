import React, { useState } from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { Spacer, TopBar, TopBarIconButton } from "~/components/uis";

const MOOD_DUMMY_DATA = [
  {
    title: "더 조용한 노래를 원해요!",
    date: "07.07",
    isConfirmed: true,
  },
  {
    title: "최신 노래를 원해요!",
    date: "07.09",
    isConfirmed: true,
  },
];

interface MoodScreenProps {
  onClickBackButton: () => void;
}

const MoodScreen = ({ onClickBackButton }: MoodScreenProps) => {
  const [isAccodionOpen, setIsAccodionOpen] = useState(true);

  return (
    <S.Container>
      <TopBar
        leftIconButton={
          <TopBarIconButton iconName="arrow-left" onClick={onClickBackButton} />
        }
      />
      <S.Title>
        원하는 무드로
        <br />
        변경하세요
      </S.Title>
      <S.Subtitle>현재 내 방의 무드는?</S.Subtitle>
      <S.MoodButton>
        <S.MoodButtonTitle># 잔잔한 내적 댄스 유발</S.MoodButtonTitle>
        <S.MoodButtonSubtitle>변경</S.MoodButtonSubtitle>
      </S.MoodButton>
      <S.Accordion>
        <S.AccordionButton onClick={() => setIsAccodionOpen(!isAccodionOpen)}>
          <S.AccordionButtonTitle>
            <Image
              src="/images/music-note.svg"
              alt=""
              width={6}
              height={10.28}
            />
            <strong>{MOOD_DUMMY_DATA.length}</strong>
            건의 신청된 무드가 있어요
          </S.AccordionButtonTitle>
          <S.AccordionButtonArrow
            animate={{ rotate: isAccodionOpen ? 180 : 0 }}
          >
            <Image
              src="/images/caret-up.svg"
              alt={isAccodionOpen ? "목록 닫기" : "목록 열기"}
              width={18}
              height={18}
            />
          </S.AccordionButtonArrow>
        </S.AccordionButton>
        <motion.div
          animate={{
            opacity: isAccodionOpen ? 1 : 0,
            height: isAccodionOpen ? undefined : 0,
          }}
        >
          <S.AccordionPanel>
            {MOOD_DUMMY_DATA.every((item) => item.isConfirmed === true) && (
              <S.Notice>전체 읽음</S.Notice>
            )}
            {MOOD_DUMMY_DATA.map((item, idx) => (
              // NOTE: 서버 데이터로 변경하기
              <S.AccordionItem key={idx}>
                <Spacer type="vertical">
                  <S.RequestTitle>{item.title}</S.RequestTitle>
                  <S.RequestDate>{item.date}</S.RequestDate>
                </Spacer>
                <S.RequestButton isConfirmed={item.isConfirmed}>
                  {item.isConfirmed ? "읽음" : "읽지 않음"}
                </S.RequestButton>
              </S.AccordionItem>
            ))}
          </S.AccordionPanel>
        </motion.div>
      </S.Accordion>
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
    background-color: rgba(0, 0, 0, 0.85);
    padding: 0 20px;
    text-align: left;
    z-index: 1;
  `,
  Title: styled.h2`
    margin-top: 16px;
    font-size: 24px;
    font-weight: 600;
    line-height: 145%;
  `,
  Subtitle: styled.p`
    margin-top: 24px;
    font-size: 16px;
    font-weight: 500;
    color: #cad1d9;
  `,
  MoodButtonGroup: styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 8px;
  `,
  MoodButton: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    padding: 20px 22px;
    font-size: 16px;
    font-weight: 600;
    color: #030303;
    border-radius: 22px;
    background-color: #404953;
  `,
  MoodButtonTitle: styled.h3`
    font-size: 16px;
    font-weight: 700;
    color: #fff;
  `,
  MoodButtonSubtitle: styled.button`
    cursor: pointer;
    font-size: 12px;
    font-weight: 300;
    color: #fff;
    border: none;
    background-color: transparent;
  `,
  MoodButtonCloseIcon: styled.button`
    width: 16px;
    height: 16px;
    margin-left: 6px;
    background-color: transparent;
    border: none;
  `,
  AddButton: styled.button`
    width: 24px;
    height: 24px;
    margin: 6px;
    background-color: transparent;
    border: none;
  `,
  Accordion: styled.div`
    position: absolute;
    bottom: 20px;
    width: calc(100% - 40px);
    padding: 0 20px;
    border-radius: 20px;
    background-color: #1a1a1a;
  `,
  AccordionButton: styled.button`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 20px 0;
    color: #fff;
    background-color: transparent;
    border: none;
  `,
  AccordionButtonTitle: styled.h4`
    font-size: 14px;
    font-weight: 400;
    & > strong {
      margin-left: 12px;
      font-weight: 800;
    }
  `,
  AccordionButtonArrow: styled(motion.div)`
    width: 18px;
    height: 18px;
  `,
  AccordionPanel: styled(motion.div)`
    padding-bottom: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  `,
  Notice: styled.div`
    text-align: right;
    padding-top: 8px;
    font-size: 12px;
    font-weight: 300;
    color: #959595;
  `,
  AccordionItem: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
  `,
  RequestTitle: styled.h5`
    font-weight: 600;
    font-size: 12px;
    line-height: 155%;
  `,
  RequestDate: styled.span`
    font-weight: 300;
    font-size: 12px;
    line-height: 155%;
    color: #959595;
  `,
  RequestButton: styled.button<{ isConfirmed: boolean }>`
    padding: 9px 16px;
    font-size: 12px;
    font-weight: 600;
    color: #fff;
    background-color: ${(props) => (props.isConfirmed ? "#007aff" : "#F54031")};
    border: none;
    border-radius: 6px;
    cursor: pointer;
  `,
};

export default MoodScreen;
