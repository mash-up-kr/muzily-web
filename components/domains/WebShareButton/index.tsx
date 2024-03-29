import type { CSSProperties, ReactNode } from "react";
import React, { useState } from "react";
import styled from "@emotion/styled";
import { Spacer, Toast } from "~/components/uis";

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
      const toBeCopiedText = `${shareURL}`;
      navigator.clipboard.writeText(toBeCopiedText);
      Toast.show(<Spacer>클립보드에 저장되었습니다.</Spacer>, {
        duration: 3000,
      });
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

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 67px;
  padding: 20px;
  font-weight: 600;
  font-size: 16px;
  color: #505050;
  background: #d9d9d9;
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.11);
  cursor: pointer;

  transition: all 200ms;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    cursor: not-allowed;
    filter: contrast(0.8);
  }
`;

export default WebShareButton;
