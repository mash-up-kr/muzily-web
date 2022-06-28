import React from "react";
import type { NextPage } from "next";
import styled from "@emotion/styled";
import QRCode from "react-qr-code";

const RoomQRPage: NextPage = () => {
  return (
    <div>
      <p>아래 QR 이미지를 공유해보세요.</p>
      <QRCodeContainer>
        <QRCode value="https://musictogether.netlify.app/" size={128} />
      </QRCodeContainer>
    </div>
  );
};

const QRCodeContainer = styled.div`
  background: white;
  padding: 16px;
`;

export default RoomQRPage;
