import React from "react";
import type { NextPage } from "next";
import { LottieEmojiSlider } from "~/components/domains";

const RoomPage: NextPage = () => {
  return (
    <div>
      RoomPage
      <LottieEmojiSlider
        trigger={({ show }) => <button onClick={show}>emoji</button>}
        onTapEnd={(e) => console.log(e)}
      />
    </div>
  );
};

export default RoomPage;
