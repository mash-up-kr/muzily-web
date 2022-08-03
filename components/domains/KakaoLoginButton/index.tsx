import type { CSSProperties, ReactNode } from "react";
import { useRouter } from "next/router";
import { useTheme } from "@emotion/react";

interface Props {
  restApiKey: string;
  redirectUri: string;
  children?: ReactNode;
  style?: CSSProperties;
}

const KakaoLoginButton = ({
  restApiKey,
  redirectUri,
  children = "",
  style,
}: Props) => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push(
      `https://kauth.kakao.com/oauth/authorize?client_id=${restApiKey}&redirect_uri=${redirectUri}&response_type=code`
    );
  };

  const kakaoLoginButtonStyle = {
    ...style,
    width: "100%",
    height: "51px",
    background: "url('images/kakao_login_large_wide.png')",
    cursor: "pointer",
    border: "none",
  };

  return (
    <button
      type="button"
      style={kakaoLoginButtonStyle}
      onClick={handleButtonClick}
    >
      {children}
    </button>
  );
};

export default KakaoLoginButton;
