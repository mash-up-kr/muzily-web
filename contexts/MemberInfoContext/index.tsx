import { createContext, useContext } from "react";
import { useAuthMember } from "~/features/auth/member";

const MemberInfoContext = createContext({
  memberInfo: null as ReturnType<typeof useAuthMember>["data"] | null,
  refetchMemberInfo: (() => {}) as ReturnType<typeof useAuthMember>["refetch"],
});

interface Props {
  children: React.ReactNode;
}

const MemberInfoProvider = ({ children }: Props) => {
  const { isLoading, isFetching, isError, isSuccess, data, refetch } =
    useAuthMember();

  if (isFetching || isLoading) {
    return <div>Loading, Fetching</div>;
  }
  if (isError) {
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
