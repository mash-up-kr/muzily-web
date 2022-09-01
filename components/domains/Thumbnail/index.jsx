import React from "react";
import styled from "@emotion/styled";

function Thumbnail({ src, color }) {
  return (
    <StyledContainer>
      <StyledThumbnail>
        <StyledImage src={src} />
        <StyledGradient color={color} />
      </StyledThumbnail>

      {/* MEMO(@Young-mason) 주석 해제하면 추출되는 색상들 확인 가능 */}
      {/* <div>extracted img color</div>
      <div style={{ display: "flex", gap: 5 }}>
        {colors.map((color) => (
          <div
            key={color}
            style={{
              backgroundColor: color,
              width: 50,
              height: 50,
            }}
          />
        ))}
      </div> */}
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const StyledImage = styled.img`
  object-fit: none;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  padding-bottom: 50px;
`;

const StyledThumbnail = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledGradient = styled.div`
  border-radius: 20px;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    ${(p) => p.color} 85%
  );
  position: absolute;
  top: 0;
`;

export default Thumbnail;
