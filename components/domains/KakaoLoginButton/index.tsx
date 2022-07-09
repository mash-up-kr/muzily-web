import type { CSSProperties, ReactNode } from "react";
import { useRouter } from "next/router";

interface Props {
  restApiKey: string;
  redirectUri: string;
  children?: ReactNode;
  style?: CSSProperties;
}

const KakaoLoginButton = ({
  restApiKey,
  redirectUri,
  children = "카카오 로그인",
  style,
}: Props) => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push(
      `https://kauth.kakao.com/oauth/authorize?client_id=${restApiKey}&redirect_uri=${redirectUri}&response_type=code`
    );
  };

  return (
    <button type="button" style={style} onClick={handleButtonClick}>
      {children}
    </button>
  );
};

export default KakaoLoginButton;
