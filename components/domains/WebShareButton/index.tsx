import type { CSSProperties, ReactNode } from "react";
import React, { useState } from "react";
import styled from "@emotion/styled";

interface Props {
  shareURL: string;
  children?: ReactNode;
  style?: CSSProperties;
  disabled: boolean;
}

type ButtonEvent = React.MouseEvent<HTMLButtonElement>;

const WebShareButton = ({
  shareURL,
  children = "공유하기",
  style,
  disabled,
}: Props) => {
  const [file, setFile] = useState<File>();

  const handleButtonClick = async (e: ButtonEvent) => {
    if (disabled === true) {
      return false;
    }

    if (!navigator.share) {
      alert("공유하기가 지원되지 않는 환경입니다.");
      e.stopPropagation();

      return false;
    }

    const qrcode: HTMLCanvasElement | null =
      document.querySelector("#react-qrcode-logo");

    qrcode?.toBlob((blob: Blob | null) => {
      if (blob === null) {
        return;
      }

      const newFile = new File([blob], "invite.png", {
        type: blob.type,
        lastModified: new Date().getTime(),
      });
      setFile(newFile);
    });

    try {
      await navigator.share({
        url: shareURL,
        files: file ? [file] : [],
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <StyledButton
      type="button"
      style={style}
      onClick={handleButtonClick}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button``;

export default WebShareButton;
