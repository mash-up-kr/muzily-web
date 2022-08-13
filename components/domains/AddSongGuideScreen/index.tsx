import React from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import { Layout, TopBar, TopBarIconButton } from "~/components/uis";
import { useRoomStore } from "~/store";

const STEPS_FOR_HOST = [
  {
    height: 183,
    src: ["/images/guide-image-1.png"],
    desc: "Youtube에 접속하고 노래를 검색하세요.",
  },
  {
    src: ["/images/guide-image-2.png", "/images/guide-image-3.png"],
    height: 183,
    desc: "원하는 노래를 선택하고 공유 버튼을 누른 후 링크를 복사하세요.",
  },
  {
    src: ["/images/guide-image-4-host.png"],
    height: 500,
    desc: "MUZILY로 돌아와서 입력창에 링크 붙여넣기한 후 원하는 곡이 맞는지 확인하세요. 원하는 곡이 맞으면 추가버튼을 눌러 곡을 추가하세요.",
  },
];

const STEPS_FOR_USER = [
  {
    height: 183,
    src: ["/images/guide-image-1.png"],
    desc: "Youtube에 접속하고 노래를 검색하세요.",
  },
  {
    src: ["/images/guide-image-2.png", "/images/guide-image-3.png"],
    height: 183,
    desc: "원하는 노래를 선택하고 공유 버튼을 누른 후 링크를 복사하세요.",
  },
  {
    src: ["/images/guide-image-4.png"],
    height: 500,
    desc: "MUZILY로 돌아와서 입력창에 링크 붙여넣기한 후 원하는 곡이 맞는지 확인하세요. 원하는 곡이 맞으면 신청버튼을 눌러 곡을 추가하세요.",
  },
];

interface AddSongGuideScreenProps {
  onClickBackButton: () => void;
}

function AddSongGuideScreen({ onClickBackButton }: AddSongGuideScreenProps) {
  const {
    state: { isHost },
  } = useRoomStore();

  const steps = isHost ? STEPS_FOR_HOST : STEPS_FOR_USER;

  return (
    <Layout screenColor="#030303">
      <TopBar
        sticky
        leftIconButton={
          <TopBarIconButton iconName="arrow-left" onClick={onClickBackButton} />
        }
      />

      <S.Title>곡 추가 방법</S.Title>

      <S.StepList>
        {steps.map((item, i) => (
          <S.Step key={i}>
            {/* <S.StepNumber>{i + 1}</S.StepNumber> */}
            <S.Desc>{item.desc}</S.Desc>

            {item.src.map((img) => (
              <S.ImageWrapper key={img} height={item.height}>
                <Image src={img} alt={img} layout="fill" />
              </S.ImageWrapper>
            ))}
          </S.Step>
        ))}
      </S.StepList>
    </Layout>
  );
}

const S = {
  Title: styled.h2`
    margin: 0;
    font-weight: 600;
    font-size: 24px;
    line-height: 145%;
    letter-spacing: -0.253163px;
    color: #ffffff;
    margin-top: 10px;
  `,

  ImageWrapper: styled.div<{ height: number }>`
    position: relative;
    width: 100%;
    height: ${(p) => p.height}px;
    margin-top: 16px;
    margin-left: -16px;
  `,

  StepList: styled.ol`
    list-style: none;
    counter-reset: step-counter;
  `,

  Step: styled.li`
    margin-top: 40px;
    list-style-type: none;
    counter-increment: step-counter;
    position: relative;
    margin-left: 30px;

    ::before {
      content: counter(step-counter);
      position: absolute;
      left: -22px;
      top: 2px;
      width: 16px;
      height: 16px;
      background: #d9d9d9;
      border-radius: 50%;
      font-weight: 700;
      font-size: 10px;
      line-height: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #010101;
    }
  `,

  Desc: styled.span`
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: -0.452636px;
    color: #ffffff;
  `,
};

export default AddSongGuideScreen;
