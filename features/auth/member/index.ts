import axios from "axios";
import { useQuery } from "react-query";
import { useLocalToken } from "~/hooks/domains";
import type { Member } from "~/types/members";

const defaultEndPoint = process.env
  .NEXT_PUBLIC_SERVER_DEFAULT_END_POINT as string;

const tokenKey = process.env.NEXT_PUBLIC_LOCAL_TOKEN_KEY as string;

export const useAuthMember = () => {
  const [localToken, setLocalToken] = useLocalToken();

  return useQuery(["auth", "member"], async () => {
    let localStorageToken: string | null = JSON.parse(
      localStorage.getItem(tokenKey) ?? "null"
    );

    if (!localStorageToken) {
      const { data } = await axios.post<{ token: string }>(
        `${defaultEndPoint}/api/v1/auth/anonymous`
      );

      setLocalToken(data.token);
      localStorageToken = data.token;
    }

    return axios.get<{
      accountConnectType: Member["accountConnectType"];
      nickname: string;
      profileUrl: string;
    }>(`${defaultEndPoint}/api/v1/members`, {
      headers: { Authorization: `Bearer ${localStorageToken}` },
    });
  });
};
