import styled from "@emotion/styled";
import { QRCode } from "react-qrcode-logo";

type QRStyleType = "dots" | "squares";

const logoSize = {
  width: 37,
  height: 40,
};
const eyeRadius = 6;
const qrSize = 198;
const qrStyle: QRStyleType = "dots";

const QRCodeWithLogo = () => {
  return (
    <QRCodeContainer>
      <QRCode
        value="http://localhost:3000/rooms/1/"
        logoImage="/images/qr-logo.ico"
        logoWidth={logoSize.width}
        logoHeight={logoSize.height}
        eyeRadius={eyeRadius}
        size={qrSize}
        qrStyle={qrStyle}
      />
    </QRCodeContainer>
  );
};

const QRCodeContainer = styled.div`
  background: white;
  padding: 16px;
`;

export default QRCodeWithLogo;
