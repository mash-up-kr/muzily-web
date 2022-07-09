import axios from "axios";
import { useQuery } from "react-query";
import { useLocalToken } from "~/hooks/domains";

type AccountConnectType = "CONNECTED" | "ANONYMOUS";

const defaultEndPoint = process.env
  .NEXT_PUBLIC_SERVER_DEFAULT_END_POINT as string;

export const useAuthMember = () => {
  const [localToken, setLocalToken] = useLocalToken();

  return useQuery(["auth", "member"], async () => {
    let usingToken = localToken;

    if (!localToken) {
      const { data } = await axios.post<{ token: string }>(
        `${defaultEndPoint}/api/v1/auth/anonymous`
      );

      usingToken = `Bearer ${data.token}`;
      setLocalToken(usingToken);
    }

    return axios.get<{
      accountConnectType: AccountConnectType;
      nickname: string;
      profileUrl: string;
    }>(`${defaultEndPoint}/api/v1/members`, {
      headers: { Authorization: usingToken },
    });
  });
};
