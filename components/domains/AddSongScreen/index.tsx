import React, { useState } from "react";
import styled from "@emotion/styled";
import YouTube from "react-youtube";
import { BottomButton } from "~/components/uis";

interface AddSongScreenProps {
  onClickBackButton: () => void;
}

function AddSongScreen(props: AddSongScreenProps) {
  const [youtubeLink, setYoutubeLink] = useState("");

  const youtubeId = getYoutubeId(youtubeLink);

  return (
    <StyledContainer>
      <button onClick={props.onClickBackButton}>뒤로가기</button>
      <StyledHeadingText>
        {`추가하고 싶은 곡의\n링크를 입력해주세요!`}
      </StyledHeadingText>

      <StyledInput
        placeholder="링크 입력해주세요"
        value={youtubeLink}
        onChange={(e) => setYoutubeLink(e.target.value)}
      />

      {youtubeId && (
        <YouTube
          videoId={youtubeId}
          opts={{
            width: 300,
            height: 200,
            playerVars: {
              autoplay: 1,
              controls: 0,
            },
          }}
        />
      )}

      <BottomButton
        label="곡 추가하기"
        onClick={() => null}
        disabled={!youtubeLink}
      />
    </StyledContainer>
  );
}

// 임시구현
function getYoutubeId(url: string) {
  const id = url.split("?v=")[1];

  return id;
}

const StyledContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background-color: #030303;
  padding: 0 20px;
`;

const StyledHeadingText = styled.h3`
  font-weight: 600;
  font-size: 24px;
  line-height: 145%;
  letter-spacing: -0.253163px;
  color: #ffffff;

  margin: 0;
  white-space: pre-wrap;
`;

const StyledInput = styled.input`
  margin-top: 24px;
  width: 100%;
  height: 49px;
  border-radius: 8px;
  padding: 0 24px;
  border: none;

  :focus {
    outline: 0;
  }
`;

export default AddSongScreen;
