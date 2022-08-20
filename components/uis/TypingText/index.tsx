import type { CSSProperties } from "react";
import React, {
  useRef,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { AnimatePresence, motion } from "framer-motion";
import { useIntervalFn } from "~/hooks/commons";

type ContextProps = {
  charIndex: number;
  nextCharIndex: () => void;
  typingTime: number;
};

const TypingTextContext = createContext({} as ContextProps);
const useTypingTextContext = () => useContext(TypingTextContext);

type TypingInfo = {
  textListIndex: number;
  typingEndCount: number;
};

interface Props {
  textList: string[];
  defaultTextListIndex?: number;
  // 한 문장 타이핑이 끝나고 기다리는 시간 (ms)
  typingEndDelay?: number;
  // 한 타이핑 시간 (ms)
  typingTime?: ContextProps["typingTime"];
  // 한 문장의 타이핑 끝났을 때 실행되는 이벤트
  onTypingEnd?: (typingInfo: TypingInfo) => Promise<void> | void;
  onTap?: (
    tapEvent: {
      textTapped: Props["textList"][number];
    } & TypingInfo
  ) => Promise<void> | void;
  style?: CSSProperties;
}

const TypingText = ({
  textList,
  defaultTextListIndex = 0,
  typingEndDelay = 0,
  typingTime = 100,
  onTypingEnd,
  onTap,
  style,
}: Props) => {
  const typingEndCount = useRef(0);
  const [textListIndex, setTextListIndex] = useState(defaultTextListIndex);
  const [charIndex, setCharIndex] = useState(0);
  const [isShow, setIsShow] = useState(true);

  const charsArray = useMemo(
    () => getCharChoJungJongTable(textList[textListIndex]),
    [textList, textListIndex]
  );

  const nextCharIndex = () => setCharIndex(charIndex + 1);

  useEffect(() => {
    setIsShow(true);

    if (charIndex === textList[textListIndex].length) {
      setTimeout(async () => {
        typingEndCount.current += 1;
        setTextListIndex((prev) =>
          prev + 1 === textList.length ? 0 : prev + 1
        );

        onTypingEnd?.({
          textListIndex,
          typingEndCount: typingEndCount.current,
        });
        if (textList.length > 1) {
          setCharIndex(() => 0);
          setIsShow(false);
        }
      }, typingTime + typingEndDelay);
    }
  }, [
    charIndex,
    textList,
    textListIndex,
    onTypingEnd,
    typingTime,
    typingEndDelay,
  ]);

  return (
    <TypingTextContext.Provider
      value={{ charIndex, nextCharIndex, typingTime }}
    >
      <AnimatePresence key={textListIndex}>
        {isShow && (
          <MotionSentence
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={style}
            cursor={onTap ? "pointer" : "default"}
            whileTap={{ scale: 0.9 }}
            onTap={() =>
              onTap?.({
                textTapped: textList[textListIndex],
                textListIndex,
                typingEndCount: typingEndCount.current,
              })
            }
          >
            {charsArray.map((chars, index) => (
              <TypingChar key={index} order={index}>
                {chars}
              </TypingChar>
            ))}
          </MotionSentence>
        )}
      </AnimatePresence>
    </TypingTextContext.Provider>
  );
};

const MotionSentence = styled(motion.div)<{ cursor: "pointer" | "default" }>`
  ${({ cursor }) =>
    css`
      cursor: ${cursor};
      user-select: none;
    `}
`;

interface TypingCharProps {
  order: number;
  children: string[];
}

const TypingChar = ({ order, children }: TypingCharProps) => {
  const [index, setIndex] = useState(-1);
  const { charIndex, nextCharIndex, typingTime } = useTypingTextContext();

  const [runInterval, clearInterval] = useIntervalFn(() => {
    const nextIndex = index + 1;

    setIndex(nextIndex);
    if (nextIndex === children.length - 1) {
      clearInterval();
      nextCharIndex();
    }
  }, typingTime);

  useEffect(() => {
    if (charIndex === order) {
      runInterval();
    }
  }, [charIndex, order, runInterval]);

  return <>{children[index]}</>;
};

export default TypingText;

const getCharChoJungJongTable = (str: string) =>
  str.split("").map(getCharacterToChoJungJong);

const getCharacterToChoJungJong = (character: string) => {
  const chars = [];
  const cCode = character.charCodeAt(0);
  // 한글이 아닌 경우
  if (cCode === 32) {
    chars.push(" ");
  } else if (cCode < 0xac00 || cCode > 0xd7a3) {
    chars.push(character.charAt(0));
  } else {
    const cCodeKor = character.charCodeAt(0) - 0xac00;
    const jong = cCodeKor % 28;
    const jung = ((cCodeKor - jong) / 28) % 21;
    const cho = ((cCodeKor - jong) / 28 - jung) / 21;

    // 테스트라는 문장이 있으면 ㅌ테ㅅ스ㅌ트 형식으로 저장되도록함 (타이핑을 위해서)
    chars.push(cCho[cho]);
    chars.push(String.fromCharCode(44032 + cho * 588 + jung * 28));
    if (cJong[jong] !== "") {
      chars.push(String.fromCharCode(44032 + cho * 588 + jung * 28 + jong));
    }
  }

  return chars;
};

const cCho = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

const cJong = [
  "",
  "ㄱ",
  "ㄲ",
  "ㄳ",
  "ㄴ",
  "ㄵ",
  "ㄶ",
  "ㄷ",
  "ㄹ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅁ",
  "ㅂ",
  "ㅄ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];
