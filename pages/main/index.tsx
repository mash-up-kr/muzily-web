import React from "react";
import type { NextPage } from "next";
import { Layout, TopBar, TopBarIconButton } from "~/components/uis";
import { StyledTopBarRightItem, StyledInviteContainer } from "./styled";

const SignupPage: NextPage = () => {
  return (
    <Layout screenColor="black">
      <TopBar
        leftIconButton={<TopBarIconButton iconName="star" />}
        rightIconButton={<StyledTopBarRightItem>로그인</StyledTopBarRightItem>}
      />
      <StyledInviteContainer></StyledInviteContainer>
    </Layout>
  );
};

export default SignupPage;
