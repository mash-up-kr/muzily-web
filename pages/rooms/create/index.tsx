import React from "react";
import type { NextPage } from "next";
import { Layout, TopBar, TopBarIconButton } from "~/components/uis";

const RoomCreatePage: NextPage = () => {
  return (
    <Layout>
      <TopBar leftIconButton={<TopBarIconButton iconName="arrow-left" />}>
        방 만들기
      </TopBar>
    </Layout>
  );
};

export default RoomCreatePage;
