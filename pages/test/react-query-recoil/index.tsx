import { useState } from "react";
import type { NextPage } from "next";
import { useRecoilState } from "recoil";
import { useMemberQuery, usePutMemberMutation } from "~/hooks/api/members";
import { videoIdAtomState } from "~/store";
import type { Member } from "~/types/members";

const TestReactQueryRecoilPage: NextPage = () => {
  const [value, setValue] = useState<Pick<Member, "nickname" | "profileUrl">>({
    nickname: "",
    profileUrl: "",
  });
  const [videoId, setVideoId] = useRecoilState(videoIdAtomState);
  const { data, isLoading, isFetching } = useMemberQuery();
  const { mutate } = usePutMemberMutation();

  if (isFetching || isLoading || data === undefined) {
    return <div>Loading, Fetching</div>;
  }

  return (
    <div>
      <h2>Member Info (use React Query)</h2>
      <ul>
        <li>{data.accountConnectType}</li>
        <li>{data.nickname}</li>
        <li>{data.profileUrl}</li>
      </ul>
      <input
        type="text"
        placeholder="nickname"
        value={value.nickname}
        onChange={(e) => setValue({ ...value, nickname: e.target.value })}
      />
      <input
        type="text"
        placeholder="profileUrl"
        value={value.profileUrl}
        onChange={(e) => setValue({ ...value, profileUrl: e.target.value })}
      />
      <button onClick={() => mutate(value)}>프로필 수정</button>
      <br />
      <h2>videoId (use Recoil)</h2>
      <div>{videoId}</div>
    </div>
  );
};

export default TestReactQueryRecoilPage;
