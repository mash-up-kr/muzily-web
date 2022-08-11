import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Spinner } from "~/components/uis";
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

    if (memberInfo === null) {
      return <Spinner.FullPage />;
    }

    const { accountConnectType } = memberInfo;

    if (!access[accountConnectType]) {
      router.replace(replaceUrl);

      return <Spinner.FullPage />;
    }

    return <Page {...props} />;
  };
};

export default withRouteGuard;
