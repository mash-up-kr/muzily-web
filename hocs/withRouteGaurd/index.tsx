import type { NextPage } from "next";
import { useRouter } from "next/router";
import { MemberInfoContext } from "~/contexts";

const withRouteGuard = <P extends object>(
  option: "prevented" | "private",
  Page: NextPage<P>
) => {
  return (props: P) => {
    const { memberInfo } = MemberInfoContext.use();
    const router = useRouter();

    if (!router.isReady || memberInfo === null) {
      return <>withRouteGuard Loading...</>;
    }

    const { accountConnectType } = memberInfo;

    if (option === "prevented" && accountConnectType === "CONNECTED") {
      router.replace("/");
    }

    if (option === "private" && accountConnectType !== "CONNECTED") {
      router.replace("/login");
    }

    return <Page {...props} />;
  };
};

export default withRouteGuard;
