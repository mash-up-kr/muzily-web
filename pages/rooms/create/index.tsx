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

const RoomCreatePage: NextPage = () => {
  const [value, setValue] = useState("");
  const router = useRouter();

  return (
    <Layout screenColor="linear-gradient(#000, 90%, #01356E)">
      <TopBar leftIconButton={<TopBarIconButton iconName="arrow-left" />}>
        방 만들기
      </TopBar>
      <StyledContainer>
        <StyledTitle>나만의 방 이름을 만들어보세요!</StyledTitle>
        <StyledInput
          value={value}
          maxLength={12}
          onChange={(e) => setValue(e.target.value)}
          placeholder="방 이름"
        />
        <StyledNoticeTextWrapper gap={4}>
          <Image
            src={`/images/info-circle-mono.svg`}
            alt="icon"
            width={14}
            height={14}
          />
          <StyledNoticeText>
            최대 빈칸 포함 12자까지 입력 가능해요.
            <br />
            이후에 언제든지 변경할 수 있습니다:)
          </StyledNoticeText>
        </StyledNoticeTextWrapper>
      </StyledContainer>
      <BottomButton
        label="다음"
        onClick={() =>
          router.push("/rooms/create/mood", { query: { roomName: value } })
        }
        disabled={value.length === 0}
      />
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
  margin: 0;
  font-size: 18px;
  font-weight: 500;
`;

const StyledInput = styled.input`
  width: 100%;
  margin-top: 32px;
  text-align: center;
  font-size: 36px;
  color: white;
  border: none;
  background: none;
  :focus {
    outline: none;
  }
`;

const StyledNoticeTextWrapper = styled(Spacer)`
  position: absolute;
  bottom: 32px;
  align-items: flex-start;
`;

const StyledNoticeText = styled.span`
  font-size: 13px;
  color: #8e96a0;
`;

export default RoomCreatePage;
