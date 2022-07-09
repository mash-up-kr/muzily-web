import styled from "@emotion/styled";
import { QRCode } from "react-qrcode-logo";

interface QRCodeWithLogoProps {
  url: string;
}

type QRStyleType = "dots" | "squares";

const logoStaticImage = "/images/qr-code-logo.png";
const logoSize = {
  width: 37,
  height: 40,
};
const eyeRadius = 6;
const qrSize = 178;
const qrStyle: QRStyleType = "dots";
const qrCodeMarginAreaSize = 20;

const QRCodeWithLogo = (props: QRCodeWithLogoProps) => {
  return (
    <QRCodeContainer>
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
      />
    </QRCodeContainer>
  );
};

const QRCodeContainer = styled.div`
  background: white;
  padding: 16px;
`;

export default QRCodeWithLogo;
