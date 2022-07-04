import React from "react";
import type { NextPage } from "next";
import animationData from "~/assets/smile.json";
import { LottieSlider } from "~/components/domains";

const RoomPage: NextPage = () => {
  return (
    <div>
      RoomPage
      <LottieSlider
        customHandle={LottieSlider.makeCustomHandle({ animationData })}
        trigger={({ show }) => <button onClick={show}>emoji</button>}
        onTapEnd={(e) => console.log(e)}
      />
    </div>
  );
};

export default RoomPage;
