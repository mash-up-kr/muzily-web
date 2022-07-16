import type { NextPage } from "next";
import { useRouter } from "next/router";
import { MemberInfo } from "~/contexts";
import type { Member } from "~/types/members";

const withRouteGuard = <P extends object>(
  access: { [accountConnectType in Member["accountConnectType"]]?: boolean },
  replaceUrl: Parameters<ReturnType<typeof useRouter>["replace"]>[0],
  Page: NextPage<P>
) => {
  return (props: P) => {
    const { memberInfo } = MemberInfo.use();
    const router = useRouter();

    if (!router.isReady || memberInfo === null) {
      return <>withRouteGuard Loading...</>;
    }

    const { accountConnectType } = memberInfo;

    if (!access[accountConnectType]) {
      router.replace(replaceUrl);

      return null;
    }

    return <Page {...props} />;
  };
};

export default withRouteGuard;
