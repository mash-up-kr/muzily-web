import { createContext, useContext } from "react";
import { useAuthMember } from "~/features/auth/member";

const MemberContext = createContext(
  null as ReturnType<typeof useAuthMember>["data"] | null
);

interface Props {
  children: React.ReactNode;
}

const MemberInfoProvider = ({ children }: Props) => {
  const { isLoading, isError, isSuccess, data } = useAuthMember();

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  if (isSuccess) {
    return (
      <MemberContext.Provider value={data}>
        {data.data.accountConnectType}
        {data.data.nickname}
        {data.data.profileUrl}
        {children}
      </MemberContext.Provider>
    );
  }

  return null;
};

const useMemberInfoContext = () => useContext(MemberContext);

export default {
  Provider: MemberInfoProvider,
  use: useMemberInfoContext,
};
