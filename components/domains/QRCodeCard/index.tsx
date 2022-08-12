import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { QRCodeWithLogo } from "~/components/uis";
import WebShareButton from "../WebShareButton";

interface QRCodeCardProps {
  roomId: string;
}

function QRCodeCard({ roomId }: QRCodeCardProps) {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const qrcode: HTMLCanvasElement | null =
      document.querySelector("#react-qrcode-logo");

    setDisabled(qrcode === null);
  });

  return (
    <S.Container>
      <S.UpContainer>
        <S.Title>QR Code</S.Title>
        <QRCodeWithLogo
          url={`https://developmusily.netlify.app/rooms/${roomId}`}
        ></QRCodeWithLogo>
      </S.UpContainer>
      <WebShareButton
        shareURL={`https://developmusily.netlify.app/rooms/${roomId}`}
        disabled={disabled}
      />
    </S.Container>
  );
}

const S = {
  Container: styled.div<{ noPlaylist?: boolean }>`
    position: relative;
    width: 220px;
    height: 314px;

    background: rgba(0, 0, 0, 1);
    border-radius: 20px;

    flex-shrink: 0;
  `,

  UpContainer: styled.div<{ noPlaylist?: boolean }>`
    position: relative;
    width: 220px;
    height: 240px;

    background: ${(p) => (p.noPlaylist ? "#007aff" : "#fff")};
    border-radius: 20px;
    padding: 20px;

    flex-shrink: 0;
    margin-bottom: 5px;
  `,

  Title: styled.span`
    font-weight: 800;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: -0.452636px;
    color: #7c7c7c;
  `,
};

export default QRCodeCard;
