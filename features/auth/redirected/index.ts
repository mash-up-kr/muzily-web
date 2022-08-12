import { useRouter } from "next/router";
import axios from "axios";
import { useQuery } from "react-query";
import { MemberInfo } from "~/contexts";
import { useLocalToken } from "~/hooks/domains";

const defaultEndPoint = process.env
  .NEXT_PUBLIC_SERVER_DEFAULT_END_POINT as string;

export const useAuthRedirected = () => {
  const [localToken, setLocalToken] = useLocalToken();
  const router = useRouter();
  const { refetchMemberInfo } = MemberInfo.use();

  return useQuery(
    ["auth", "code"],
    async () => {
      const { data } = await axios.post<{ token: string }>(
        `${defaultEndPoint}/api/v1/auth`,
        {
          code: `${router.query.code}`,
          redirectUri: process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI,
          socialType: "KAKAO",
        }
      );

      setLocalToken(data.token);

      return data;
    },
    {
      onSuccess: () => {
        refetchMemberInfo();
        router.replace("/rooms/create");
      },
    }
  );
};
