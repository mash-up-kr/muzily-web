import React from "react";
import styled from "@emotion/styled";

interface PlaylistCardProps {
  onClick: () => void;
}

function PlaylistCard({ onClick }: PlaylistCardProps) {
  return (
    <StyledContainer onClick={onClick}>
      <Title>Playlist</Title>

      <Content>더 보기</Content>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  cursor: pointer;
  width: 220px;
  height: 314px;

  background: #ff793a;
  border-radius: 20px;
  padding: 20px;
  flex-shrink: 0;
`;

const Title = styled.h3`
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
export default PlaylistCard;
