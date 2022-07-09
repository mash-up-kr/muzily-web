import axios from "axios";
import { useQuery } from "react-query";

const defaultEndPoint = process.env
  .NEXT_PUBLIC_SERVER_DEFAULT_END_POINT as string;

export const useAuthRedirected = ({ code }: { code: string }) => {
  return useQuery(["auth", "code"], async () => {
    return axios.post<{ token: string }>(`${defaultEndPoint}/api/v1/auth`, {
      code,
      redirectUri: process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI,
      socialType: "KAKAO",
    });
  });
};
