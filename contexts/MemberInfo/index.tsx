import { createContext, useContext } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { useAuthMember } from "~/features/auth/member";
import type { Member } from "~/types/members";

const MemberInfoContext = createContext({
  memberInfo: null as Member | null,
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
        value={{ memberInfo: data.data, refetchMemberInfo: refetch }}
      >
        <S.MemberDataTempContainer>
          <div>accountConnectType: {data.data.accountConnectType}</div>
          <div>nickname: {data.data.nickname}</div>
          <div>profileUrl: {data.data.profileUrl}</div>
        </S.MemberDataTempContainer>
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

const S = {
  MemberDataTempContainer: styled.div`
    background-color: #ffd500;
  `,
};
