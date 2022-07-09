import { useEffect, useState } from "react";
import type { NextPage } from "next";
import WebShareButton from "~/components/domains/WebShareButton";
import QRCodeWithLogo from "~/components/uis/QRCodeWithLogo";

const MainPage: NextPage = () => {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const qrcode: HTMLCanvasElement | null =
      document.querySelector("#react-qrcode-logo");

    setDisabled(qrcode === null);
  });

  return (
    <div>
      <QRCodeWithLogo url="http://www.naver.com"></QRCodeWithLogo>
      <WebShareButton shareURL="http://www.naver.com" disabled={disabled} />
    </div>
  );
};

export default MainPage;
