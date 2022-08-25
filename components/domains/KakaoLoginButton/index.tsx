import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "@emotion/styled";

interface Props {
  restApiKey: string;
  redirectUri: string;
  children?: ReactNode;
  style?: CSSProperties;
}

const KakaoLoginButton = ({ restApiKey, redirectUri, style }: Props) => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push(
      `https://kauth.kakao.com/oauth/authorize?client_id=${restApiKey}&redirect_uri=${redirectUri}&response_type=code`
    );
  };

  return (
    <S.Button style={{ ...style }} onClick={handleButtonClick}>
      <S.ButtonIcon>
        <Image src="/images/icon-kakao.svg" alt="" width={21} height={19} />
      </S.ButtonIcon>
      카카오로 시작하기
    </S.Button>
  );
};

const S = {
  Button: styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    padding: 0 50px;
    gap: 8px;
    color: #000;
    background-color: #fee500;
    border-radius: 6px;
  `,
  ButtonIcon: styled.div`
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
  `,
};

export default KakaoLoginButton;
