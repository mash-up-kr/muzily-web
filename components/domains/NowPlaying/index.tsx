import React from "react";
import Image from "next/image";
import styled from "@emotion/styled";

interface NowPlayingCardProps {
  noPlaylist?: boolean;
}

function NowPlayingCard({ noPlaylist = false }: NowPlayingCardProps) {
  // 재생 중인 노래 없는경우
  if (noPlaylist) {
    return (
      <StyledContainer>
        <Title>Now Playing</Title>
        <Content>
          <NoPlaylistText>{`재생 중인\n노래가 없어요`}</NoPlaylistText>

          <Image
            src="/images/no-music-emoji.svg"
            alt="no-music"
            width={160}
            height={160}
          />

          <SubText>지금 바로 추가해보세요</SubText>
        </Content>
      </StyledContainer>
    );
  }
  // 재생 중인 노래 있는경우
  else {
    return <div>asdsd</div>;
  }
}

const StyledContainer = styled.div`
  cursor: pointer;
  width: 220px;
  height: 314px;

  background: #007aff;
  border-radius: 20px;
  padding: 20px;
`;

const Title = styled.h3`
  margin: 0;
  font-weight: 800;
  font-size: 14px;
  line-height: 17px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`;

const NoPlaylistText = styled.div`
  text-align: center;
  white-space: pre-wrap;
`;

const SubText = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: -0.04em;
  color: rgba(255, 255, 255, 0.65);
`;

export default NowPlayingCard;
