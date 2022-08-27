import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { QRCodeWithLogo } from "~/components/uis";
import { useRoomQuery } from "~/hooks/api";
import WebShareButton from "../WebShareButton";

interface QRCodeCardProps {
  roomId: string;
}

function QRCodeCard({ roomId }: QRCodeCardProps) {
  const [inviteURL, setInviteURL] = useState("");
  const { data } = useRoomQuery(Number(roomId));
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const qrcode: HTMLCanvasElement | null =
      document.querySelector("#react-qrcode-logo");
    setDisabled(qrcode === null);
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      setInviteURL(
        `${window.location.protocol}//${window.location.host}/rooms/${roomId}/invite?inviteKey=${data.invitation.invitationKey}`
      );
    }
  }, [data]);

  return (
    <S.Container>
      <S.UpContainer>
        <S.Title>QR Code</S.Title>
        <QRCodeWithLogo url={inviteURL}></QRCodeWithLogo>
      </S.UpContainer>
      <WebShareButton shareURL={inviteURL} disabled={disabled} />
    </S.Container>
  );
}

const S = {
  Container: styled.div<{ noPlaylist?: boolean }>`
    height: 50vh;
    position: relative;
    background: rgba(0, 0, 0, 1);
    border-radius: 20px;
    display: flex;
    flex-direction: column;

    /* flex-shrink: 0; */
  `,

  UpContainer: styled.div<{ noPlaylist?: boolean }>`
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 16px;
    justify-content: center;
    align-items: center;

    background: ${(p) => (p.noPlaylist ? "#007aff" : "#fff")};
    border-radius: 20px;
    padding: 20px;
  `,

  Title: styled.span`
    font-weight: 800;
    font-size: 24px;
    line-height: 17px;
    letter-spacing: -0.452636px;
    color: #cccccc;
  `,
};

export default QRCodeCard;
