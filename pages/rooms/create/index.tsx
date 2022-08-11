import React, { useState } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import styled from "@emotion/styled";
import {
  BottomButton,
  Spacer,
  TopBar,
  TopBarIconButton,
} from "~/components/uis";
import { withRouteGuard } from "~/hocs";

const RoomCreatePage: NextPage = withRouteGuard(
  { CONNECTED: true },
  "/login",
  () => {
    const [value, setValue] = useState("");

    return (
      <>
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
        <Link
          href={{ pathname: "/rooms/create/mood", query: { roomName: value } }}
        >
          <a>
            <BottomButton label="다음" disabled={value.length === 0} />
          </a>
        </Link>
      </>
    );
  }
);

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
