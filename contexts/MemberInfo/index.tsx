import { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { useAuthMember } from "~/features/auth/member";
import type { Member } from "~/types/members";

let count = 0;

const MemberInfoContext = createContext({
  memberInfo: {} as Member,
  refetchMemberInfo: (() => {}) as ReturnType<typeof useAuthMember>["refetch"],
});

interface Props {
  children: React.ReactNode;
}

const MemberInfoProvider = ({ children }: Props) => {
  const router = useRouter();
  const { isLoading, isFetching, isError, isSuccess, data, refetch } =
    useAuthMember();

  useEffect(() => {
    if (isError && count === 0) {
      alert("인증에 실패했습니다. 다시 로그인해주세요");
      localStorage.clear();
      router.replace("/login");
      count += 1;
    }
  }, [isError]);

  if (isFetching || isLoading) {
    return <div>Loading, Fetching</div>;
  }

  if (isSuccess) {
    return (
      <MemberInfoContext.Provider
        value={{ memberInfo: data, refetchMemberInfo: refetch }}
      >
        <S.MemberDataTempContainer>
          <div>accountConnectType: {data.accountConnectType}</div>
          <div>nickname: {data.nickname}</div>
          <div>profileUrl: {data.profileUrl}</div>
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
