import React, { useState } from "react";
import { Spacer, TypingText } from "~/components/uis";

const TypingAnimationTestPage = () => {
  const [typingTime, setTypingTime] = useState(100);
  const [isTypingText, setIsTypingText] = useState(true);

  return (
    <Spacer justify="center" align="center" style={{ height: "50vh" }}>
      {isTypingText && (
        <TypingText
          textList={[
            "# 가게에서 손님과",
            "# 시원한 드라이브를 위해",
            "# 캠프가서 자유롭게",
            "# 사랑하는 연인과",
          ]}
          typingTime={typingTime}
          typingEndDelay={1000}
          style={{ fontSize: 30, fontWeight: "bold" }}
          onTypingEnd={async ({ textListIndex, typingEndCount }) => {
            console.log({ typingTime, textListIndex, typingEndCount });

            if (textListIndex === 3) {
              // 1. 점점 타이핑의 속도가 빨라지도록 typingTime를 조절해볼까요?
              setTypingTime((prev) => prev / 2);
            }

            // 2. 혹은 100번 타이핑이 되면 이 Typing Text가 없어지면 어떨까요?
            if (typingEndCount === 100) {
              setIsTypingText(false);
            }
          }}
          onTap={async ({ textTapped, textListIndex, typingEndCount }) => {
            console.log({ textTapped, textListIndex, typingEndCount });
          }}
        />
      )}
    </Spacer>
  );
};

export default TypingAnimationTestPage;
