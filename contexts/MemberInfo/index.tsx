import React, { createContext, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useQuery } from "react-query";
import { Toast } from "~/components/uis";
import { usePostAuthAnonymousMutation } from "~/hooks/api";
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

    const { data } = await axios.get<Member>(
      `${defaultEndPoint}/api/v1/members`,
      {
        headers: { Authorization: `Bearer ${localStorageToken}` },
      }
    );

    return data;
  });
};

const MemberInfoContext = createContext({
  memberInfo: {} as Member | null,
  refetchMemberInfo: (() => {}) as ReturnType<typeof useAuthMember>["refetch"],
  removeMemberInfo: (() => {}) as ReturnType<typeof useAuthMember>["remove"],
  isLoading: false,
  isFetching: false,
  error: null as unknown | null, // TODO: unknown 정의하기
  isError: false,
});

interface Props {
  children: React.ReactNode;
}

const MemberInfoProvider = ({ children }: Props) => {
  const router = useRouter();
  const { isLoading, isFetching, error, isError, data, refetch, remove } =
    useAuthMember();

  useEffect(() => {
    if (isError) {
      Toast.show("인증에 실패했습니다. 다시 로그인해주세요", {
        status: "error",
        duration: 2000,
      });
      localStorage.removeItem(tokenKey);
      router.replace("/login");
    }
  }, [isError]);

  return (
    <MemberInfoContext.Provider
      value={{
        memberInfo: data || null,
        refetchMemberInfo: refetch,
        removeMemberInfo: remove,
        isLoading,
        isFetching,
        isError,
        error,
      }}
    >
      {children}
    </MemberInfoContext.Provider>
  );
};

interface MemberInfoOnlyProps {
  fallback?: React.ReactNode;
  children: (props: {
    memberInfo: Member;
    refetchMemberInfo: ReturnType<
      typeof useMemberInfoContext
    >["refetchMemberInfo"];
    removeMemberInfo: ReturnType<
      typeof useMemberInfoContext
    >["removeMemberInfo"];
  }) => React.ReactElement;
}

const MemberInfoOnly = ({ fallback, children }: MemberInfoOnlyProps) => {
  const { isLoading, memberInfo, refetchMemberInfo, removeMemberInfo } =
    useMemberInfoContext();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (memberInfo) {
    return children({ memberInfo, refetchMemberInfo, removeMemberInfo });
  }

  return null;
};

const useMemberInfoContext = () => useContext(MemberInfoContext);

const MemberInfo = {
  Provider: MemberInfoProvider,
  use: useMemberInfoContext,
  Only: MemberInfoOnly,
};

export default MemberInfo;
