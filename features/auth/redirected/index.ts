import axios from "axios";
import { useQuery } from "react-query";
import { useLocalToken } from "~/hooks/domains";

const defaultEndPoint = process.env
  .NEXT_PUBLIC_SERVER_DEFAULT_END_POINT as string;

export const useAuthRedirected = ({ code }: { code: string }) => {
  const [localToken, setLocalToken] = useLocalToken();

  return useQuery(["auth", "code"], async () => {
    const { data } = await axios.post<{ token: string }>(
      `${defaultEndPoint}/api/v1/auth`,
      {
        code,
        redirectUri: process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI,
        socialType: "KAKAO",
      }
    );

    const bearerToken = `Bearer ${data.token}`;
    setLocalToken(bearerToken);

    return axios.get(`${defaultEndPoint}/api/v1/members`, {
      headers: { Authorization: bearerToken },
    });
  });
};
