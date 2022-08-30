import React, { useState } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { AxiosError } from "axios";
import {
  BottomButton,
  Layout,
  Spacer,
  TopBar,
  TopBarIconButton,
} from "~/components/uis";
import { usePostRoomMutation } from "~/hooks/api";
import type { Mood } from "~/types/rooms";

const MOOD_EMOJI_IMAGES = {
  BOOK: "book-3d",
  MIRROR_BALL: "mirror-3d",
  HEART: "heart-3d",
};

const MOOD_ITEM_LIST: Mood[] = [
  {
    moodDescription: "# 조용~ 집중 빡 공부 모드",
    emojiType: "BOOK",
  },
  {
    moodDescription: "# 쉣댓 부레 엉덩이~! 흔들어버려",
    emojiType: "MIRROR_BALL",
  },
  {
    moodDescription: "# 잔잔한 내적 댄스 유발",
    emojiType: "HEART",
  },
];

const RoomCreateMoodPage: NextPage = () => {
  const router = useRouter();
  const { roomName } = router.query as { roomName: string };
  const [mood, setMood] = useState(MOOD_ITEM_LIST[0]);
  const [isEdit, setIsEdit] = useState(false);
  const [isCustomButtonActive, setIsCustomButtonActive] = useState(false);
  const [selectedMood, setSelectedMood] = useState({
    moodDescription: "", // TODO: API 구현 완료되면 무드 이름도 추가해야 함
    emojiType: MOOD_ITEM_LIST[0].emojiType,
  } as Mood);

  const postRoomMutation = usePostRoomMutation();

  const onClickCreateRoom = () => {
    let postMoodData: Mood = mood;
    if (isEdit && selectedMood) {
      postMoodData = selectedMood;
    }

    postRoomMutation.mutate(
      {
        name: roomName,
        emojiType: postMoodData.emojiType,
        moodDescription: postMoodData.moodDescription,
      },
      {
        onSuccess: (data) => {
          const { roomId } = data;
          router.push(`/rooms/${roomId}/?isHost=true`);
        },
        onError: (error: AxiosError) => {
          if (error instanceof AxiosError) {
            window.alert(error.response?.data.message);
          }
          console.error(error);
        },
      }
    );
  };

  return (
    <Layout screenColor="linear-gradient(#000, 90%, #01356E)">
      <TopBar
        sticky
        leftIconButton={<TopBarIconButton iconName="arrow-left" />}
      >
        방 만들기
      </TopBar>
      <S.Container>
        <S.Title>
          <S.Ticket>{roomName}</S.Ticket>의 무드는?
        </S.Title>
        <S.SubTitle>무드에 맞춘 이모지를 제공해드려요!</S.SubTitle>
        <S.ButtonGroup type="vertical" gap={15}>
          {MOOD_ITEM_LIST.map((item) => (
            <S.Button
              key={item.moodDescription}
              onClick={() => {
                setIsEdit(false);
                setMood(item);
              }}
              isActive={mood.moodDescription === item.moodDescription}
            >
              <S.ButtonText>{item.moodDescription}</S.ButtonText>
              <Image
                src={`/images/${MOOD_EMOJI_IMAGES[item.emojiType]}.svg`}
                alt="icon"
                width={56}
                height={58}
              />
            </S.Button>
          ))}
          {isCustomButtonActive && (
            <S.Button
              key={mood.emojiType}
              onClick={() => {
                if (!isEdit) {
                  setMood({
                    ...selectedMood,
                    moodDescription: "",
                  });
                  setIsEdit(!isEdit);
                }
              }}
              isActive={isEdit}
              style={{ paddingRight: "16px" }}
            >
              <S.MoodPrefixText isActive={isEdit}>#</S.MoodPrefixText>
              <S.MoodInputText
                type="text"
                placeholder="직접 입력"
                value={selectedMood.moodDescription}
                onChange={(e) => {
                  setSelectedMood({
                    moodDescription: e.target.value,
                    emojiType: selectedMood.emojiType,
                  });
                }}
                maxLength={20}
                isActive={isEdit}
              ></S.MoodInputText>
              <div style={{ flex: 1 }} />
              <S.MoodGroupContainer>
                {MOOD_ITEM_LIST.map((item) => (
                  <S.MoodSelectedContainer
                    key={item.moodDescription}
                    isSelectedMood={item.emojiType === selectedMood.emojiType}
                  >
                    <Image
                      src={`/images/${MOOD_EMOJI_IMAGES[item.emojiType]}.svg`}
                      alt="icon"
                      width={56}
                      height={58}
                      onClick={() => {
                        if (isEdit) {
                          setSelectedMood({
                            moodDescription: selectedMood.moodDescription,
                            emojiType: item.emojiType,
                          });
                        }
                      }}
                    />
                  </S.MoodSelectedContainer>
                ))}
              </S.MoodGroupContainer>
            </S.Button>
          )}
        </S.ButtonGroup>
        {!isCustomButtonActive && (
          <S.BottomButton onClick={() => setIsCustomButtonActive(true)}>
            직접 입력&nbsp;
            <Image src={`/images/plus.svg`} alt="icon" width={14} height={14} />
          </S.BottomButton>
        )}
      </S.Container>
      <BottomButton
        label="방 만들기"
        onClick={onClickCreateRoom}
        disabled={
          selectedMood.moodDescription === "" && mood.moodDescription === ""
        }
      />
    </Layout>
  );
};

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    height: calc(100% - 124px);
    padding: 20px 16px;
  `,
  Title: styled.h3`
    display: flex;
    align-items: center;
    font-size: 18px;
  `,
  Ticket: styled.div`
    position: relative;
    min-width: 78px;
    margin-right: 6px;
    padding: 8px 16px;
    text-align: center;
    font-size: 18px;
    font-weight: 800;
    color: #fff;
    &:before {
      content: "";
      position: absolute;
      z-index: -1;
      left: 0;
      top: 0;
      width: 74%;
      height: 100%;
      border-radius: 6px;
      background-color: #007aff;
    }
    &:after {
      content: "";
      position: absolute;
      z-index: -1;
      right: 0;
      top: 0;
      width: 26%;
      height: 100%;
      border-radius: 6px;
      background-color: #007aff;
    }
  `,
  SubTitle: styled.p`
    margin-top: 17px;
    font-size: 16px;
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
    height: 58px;
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
  BottomButton: styled.button`
    cursor: pointer;
    position: absolute;
    bottom: 30px;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: white;
    background-color: transparent;
    border: none;
  `,
  MoodPrefixText: styled.span<{ isActive: boolean }>`
    color: ${(p) => (p.isActive ? "#007AFF" : "white")};
    font-size: 16px;
    font-weight: 700;
    line-height: 19px;
    background-color: transparent;
  `,
  MoodInputText: styled.input<{ isActive: boolean }>`
    max-width: 40%;
    margin: 0 3px;
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
    :focus {
      outline: 0;
    }
  `,
  MoodGroupContainer: styled.div`
    height: 80%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 16px;
  `,
  MoodSelectedContainer: styled.div<{ isSelectedMood: boolean }>`
    height: 100%;
    width: 100%;
    min-width: 56px;
    border-radius: 16px;
    background-color: ${(p) =>
      p.isSelectedMood ? "rgba(0, 0, 0, 0.07)" : "transparent"};
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;

    & img {
      transform: translateX(-6px);
    }
  `,
};

export default RoomCreateMoodPage;
