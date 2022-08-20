import React, { useState } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import {
  BottomButton,
  Spacer,
  TopBar,
  TopBarIconButton,
} from "~/components/uis";
import { usePostRoomMutation } from "~/hooks/api";
import type { Mood, MoodWithImageName } from "~/types/rooms";

const moodConstants: MoodWithImageName[] = [
  {
    name: "# 조용~ 집중 빡 공부 모드",
    emojiType: "BOOK",
    emojiTypeImageName: "book-3d",
  },
  {
    name: "# 쉣댓 부레 엉덩이~! 흔들어버려",
    emojiType: "MIRROR_BALL",
    emojiTypeImageName: "mirror-3d",
  },
  {
    name: "# 잔잔한 내적 댄스 유발",
    emojiType: "HEART",
    emojiTypeImageName: "heart-3d",
  },
];

const RoomCreateMoodPage: NextPage = () => {
  const router = useRouter();

  const [mood, setMood] = useState({} as Mood);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedMood, setSelectedMood] = useState({
    name: "",
    emojiType: moodConstants[0].emojiType,
  } as Mood);

  const postRoomMutation = usePostRoomMutation();

  const onClickCreateRoom = () => {
    let postMoodData: Mood = mood;
    if (isEdit && selectedMood) {
      postMoodData = selectedMood;
    }

    postRoomMutation.mutate(postMoodData, {
      onSuccess: (data) => {
        const { roomId } = data;
        router.push(`/rooms/${roomId}/?isHost=true`);
      },
    });
  };

  return (
    <>
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
          {moodConstants.map((moodConstant) => (
            <StyledButton
              key={moodConstant.name}
              onClick={() => {
                setIsEdit(false);
                setMood(moodConstant);
              }}
              isActive={mood.name === moodConstant.name}
            >
              <StyledButtonText>{moodConstant.name}</StyledButtonText>
              <Image
                src={`/images/${moodConstant.emojiTypeImageName}.svg`}
                alt="icon"
                width={56}
                height={58}
              />
            </StyledButton>
          ))}
          <StyledButton
            key={mood.emojiType}
            onClick={() => {
              if (!isEdit) {
                setSelectedMood({
                  emojiType: moodConstants[0].emojiType,
                  name: selectedMood.name,
                });
                setMood({
                  ...selectedMood,
                  name: "",
                });
                setIsEdit(!isEdit);
              }
            }}
            isActive={isEdit}
          >
            <StyledMoodPrefixText isActive={isEdit}>#</StyledMoodPrefixText>
            <StyledMoodInputText
              placeholder="직접 입력"
              value={selectedMood.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSelectedMood({
                  name: e.target.value,
                  emojiType: selectedMood.emojiType,
                });
              }}
              isActive={isEdit}
            ></StyledMoodInputText>
            <StyledMoodGroupContainer>
              {moodConstants.map((moodConstant) => (
                <StyledMoodSelectedContainer
                  key={moodConstant.name}
                  isSelectedMood={
                    moodConstant.emojiType === selectedMood.emojiType
                  }
                >
                  <Image
                    src={`/images/${moodConstant.emojiTypeImageName}.svg`}
                    alt="icon"
                    width={56}
                    height={58}
                    onClick={() => {
                      if (isEdit) {
                        setSelectedMood({
                          name: selectedMood.name,
                          emojiType: moodConstant.emojiType,
                        });
                      }
                    }}
                  />
                </StyledMoodSelectedContainer>
              ))}
            </StyledMoodGroupContainer>
          </StyledButton>
        </StyledButtonGroup>
      </StyledContainer>
      <BottomButton label="방 만들기" onClick={onClickCreateRoom} />
    </>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  height: calc(100% - 104px);
  padding: 20px 16px;
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

const StyledMoodPrefixText = styled.span<{ isActive: boolean }>`
  color: ${(p) => (p.isActive ? "#007AFF" : "white")};
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  background-color: transparent;
`;

const StyledMoodInputText = styled.input<{ isActive: boolean }>`
  color: ${(p) => (p.isActive ? "#007AFF" : "white")};
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  background-color: transparent;
  border: none;
  height: 100%;

  &::placeholder {
    color: ${(p) => (p.isActive ? "#007AFF" : "white")};
    font-size: 16px;
    font-weight: 700;
    line-height: 19px;
  }
`;

const StyledMoodGroupContainer = styled.div`
  height: 80%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #f0f0f0;
  border-radius: 16px;
`;

const StyledMoodSelectedContainer = styled.div<{ isSelectedMood: boolean }>`
  height: 100%;
  width: 100%;
  border-radius: 16px;
  background-color: ${(p) => (p.isSelectedMood ? "#e2e2e2" : "transparent")};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export default RoomCreateMoodPage;
