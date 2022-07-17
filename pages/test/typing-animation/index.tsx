import React, { useState } from "react";
import { Spacer, TypingText } from "~/components/uis";

const hashTags = [
  "# 가게에서 손님과",
  "# 시원한 드라이브를 위해",
  "# 캠프가서 자유롭게",
  "# 사랑하는 연인과",
];

const TypingAnimationTestPage = () => {
  const [index, setIndex] = useState(0);

  return (
    <Spacer justify="center" align="center" style={{ height: "50vh" }}>
      <TypingText
        typingSpeed={50}
        typingEndDelay={1000}
        onTypingEnd={() =>
          setIndex((prev) => (prev + 1 === hashTags.length ? 0 : prev + 1))
        }
        style={{ fontSize: 30, fontWeight: "bold" }}
      >
        {hashTags[index]}
      </TypingText>
    </Spacer>
  );
};

export default TypingAnimationTestPage;
