import { createContext, useContext } from "react";
import { useRouter } from "next/router";
import { useAuthMember } from "~/features/auth/member";

const MemberInfoContext = createContext({
  memberInfo: null as ReturnType<typeof useAuthMember>["data"] | null,
  refetchMemberInfo: (() => {}) as ReturnType<typeof useAuthMember>["refetch"],
});

interface Props {
  children: React.ReactNode;
}

const MemberInfoProvider = ({ children }: Props) => {
  const router = useRouter();
  const { isLoading, isFetching, isError, isSuccess, data, refetch } =
    useAuthMember();

  if (isFetching || isLoading) {
    return <div>Loading, Fetching</div>;
  }
  if (isError) {
    alert("인증에 실패했습니다. 다시 로그인해주세요");
    localStorage.clear();
    router.push("/login");

    return <div>Error</div>;
  }

  if (isSuccess) {
    return (
      <MemberInfoContext.Provider
        value={{ memberInfo: data, refetchMemberInfo: refetch }}
      >
        {data.data.accountConnectType}
        {data.data.nickname}
        {data.data.profileUrl}
        {children}
      </MemberInfoContext.Provider>
    );
  }

  return null;
};

const useMemberInfoContext = () => useContext(MemberInfoContext);

export default {
  Provider: MemberInfoProvider,
  use: useMemberInfoContext,
};
