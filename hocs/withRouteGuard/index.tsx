import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Skeleton, Spacer } from "~/components/uis";
import { MemberInfo } from "~/contexts";
import type { Member } from "~/types/members";

const withRouteGuard = <P extends object>(
  access: { [accountConnectType in Member["accountConnectType"]]?: boolean },
  replaceUrl: Parameters<ReturnType<typeof useRouter>["replace"]>[0],
  Page: NextPage<P>
) => {
  return (props: P) => {
    const { memberInfo, isError, refetchMemberInfo } = MemberInfo.use();
    const router = useRouter();

    useEffect(() => {
      if (isError && memberInfo === null) {
        refetchMemberInfo();
      }
    }, [memberInfo, refetchMemberInfo, isError]);

    if (memberInfo === null) {
      return (
        <Spacer type="vertical" justify="center" style={{ height: "100%" }}>
          <div style={{ margin: 16 }}>
            <Skeleton.Circle size={60} />
            <Skeleton.Paragraph fontSize={12} line={5} lineBreak={3} />
          </div>
        </Spacer>
      );
    }

    const { accountConnectType } = memberInfo;

    if (!access[accountConnectType]) {
      router.replace(replaceUrl);

      return (
        <Spacer type="vertical" justify="center" style={{ height: "100%" }}>
          <div style={{ margin: 16 }}>
            <Skeleton.Circle size={60} />
            <Skeleton.Paragraph fontSize={12} line={5} lineBreak={3} />
          </div>
        </Spacer>
      );
    }

    return <Page {...props} />;
  };
};

export default withRouteGuard;
