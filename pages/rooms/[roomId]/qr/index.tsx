import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { QRCodeWithLogo } from "~/components/uis";

const RoomQRPage: NextPage = () => {
  const [inviteURL, setInviteURL] = useState("");
  const router = useRouter();
  const { roomId } = router.query;

  useEffect(() => {
    setInviteURL(
      `${window.location.protocol}//${window.location.host}/rooms/${roomId}/invite`
    );
  });

  return (
    <div>
      <p>아래 QR 이미지를 공유해보세요.</p>
      <QRCodeWithLogo
        data-testid="QRCodeWithLogo"
        url={inviteURL}
      ></QRCodeWithLogo>
    </div>
  );
};

export default RoomQRPage;
