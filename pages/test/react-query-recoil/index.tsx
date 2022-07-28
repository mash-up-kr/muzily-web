import type { NextPage } from "next";
import { useRecoilState } from "recoil";
import { useMember } from "~/hooks/api";
import { videoIdAtomState } from "~/store";

const TestReactQueryRecoilPage: NextPage = () => {
  const [videoId, setVideoId] = useRecoilState(videoIdAtomState);
  const { data, isLoading, isFetching } = useMember();

  if (isFetching || isLoading || data === undefined) {
    return <div>Loading, Fetching</div>;
  }

  return (
    <div>
      <h3>useMember</h3>
      <ul>
        <li>{data.accountConnectType}</li>
        <li>{data.nickname}</li>
        <li>{data.profileUrl}</li>
      </ul>
      <h3>videoId</h3>
      <div>{videoId}</div>
    </div>
  );
};

export default TestReactQueryRecoilPage;
