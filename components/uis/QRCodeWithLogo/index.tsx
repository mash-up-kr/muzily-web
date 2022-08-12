import React from "react";
import { QRCode } from "react-qrcode-logo";

interface QRCodeWithLogoProps {
  url: string;
}

type QRStyleType = "dots" | "squares";

const logoStaticImage = "/images/qr-code-logo.svg";
const logoSize = {
  width: 20,
  height: 20,
};
const eyeRadius = 9;
const qrSize = 157;
const qrStyle: QRStyleType = "dots";
const qrCodeMarginAreaSize = 10;

const QRCodeWithLogo = (props: QRCodeWithLogoProps) => {
  return (
    <QRCode
      value={props.url}
      logoImage={logoStaticImage}
      logoWidth={logoSize.width}
      logoHeight={logoSize.height}
      eyeRadius={eyeRadius}
      size={qrSize}
      qrStyle={qrStyle}
      removeQrCodeBehindLogo={true}
      quietZone={qrCodeMarginAreaSize}
      bgColor="white"
    />
  );
};

export default QRCodeWithLogo;
