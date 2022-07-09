import React from "react";
import type { NextPage } from "next";
import styled from "@emotion/styled";
import QR from "~/components/uis/QR";

const RoomQRPage: NextPage = () => {
  return (
    <div>
      <p>아래 QR 이미지를 공유해보세요.</p>
      <QR></QR>
    </div>
  );
};

export default RoomQRPage;
