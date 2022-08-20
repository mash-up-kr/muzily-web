/* eslint-disable no-console */
import { useEffect } from "react";
import type { NextPage } from "next";
import { useRecoilValue } from "recoil";
import RoomSocketProvider from "~/contexts/RoomSocket";
import { useEmoji, useAddPlaylistItemRequest } from "~/hooks/webSocket";
import { emojiAtomState } from "~/store/emoji";
import { playlistAtomState, proposedPlaylistAtomState } from "~/store/playlist";

const ROOM_ID = 1; // XXX: for test. room 정보 api 연동되면 삭제
const SocketTestContentPage: NextPage = () => {
  const emoji = useRecoilValue(emojiAtomState);
  const playlist = useRecoilValue(playlistAtomState);
  const proposedPlaylist = useRecoilValue(proposedPlaylistAtomState);
  const { publish: publishEmoji } = useEmoji(ROOM_ID, {
    emojiType: "HEART",
    intensity: 100,
  });
  const { publish: publishPlaylist } = useAddPlaylistItemRequest(ROOM_ID, {
    playlistId: ROOM_ID,
    videoId: "LqfimuFAFJ8",
    title: "라일락",
    duration: "229",
    thumbnail: "https://i.ytimg.com/vi/LqfimuFAFJ8/maxresdefault.jpg",
    dominantColor: "#FFFFFF",
  });
  useEffect(() => {
    console.log("emoji", emoji);
    console.log("playlist", playlist);
    console.log("userQueue", proposedPlaylist);
  }, [emoji, playlist, proposedPlaylist]);

  return (
    <div>
      <h2>확인 방법: 버튼을 눌렀을 때 console.log 값 나오는거 확인</h2>
      <button onClick={() => publishEmoji()}>이모지 날리기</button>
      <br />
      <button onClick={() => publishPlaylist()}>플레이리스트 추가하기</button>
    </div>
  );
};

const SocketTestPage: NextPage = () => {
  return (
    <RoomSocketProvider roomId="1">
      <SocketTestContentPage />
    </RoomSocketProvider>
  );
};

export default SocketTestPage;
