import { useRecoilState, useRecoilValue } from "recoil";
import { playlistAtomState } from "~/store/playlist";
import { playerAtomState } from "~/store/room";
import { getMusicIndex } from "~/store/room/utils";

export default function usePlayerActions() {
  const [playerState, setPlayerState] = useRecoilState(playerAtomState);
  const playlist = useRecoilValue(playlistAtomState);

  function playPrevMusic() {
    const playingIndex = getMusicIndex(playerState.playingMusicId, playlist);
    if (playingIndex === 0) {
      return null;
    }

    setPlayerState((prev) => ({
      ...prev,
      playingMusicId: playlist[playingIndex - 1].id,
    }));
  }

  const playNextMusic = () => {
    const playingIndex = getMusicIndex(playerState.playingMusicId, playlist);
    if (playingIndex === playlist.length - 1) {
      return null;
    }

    setPlayerState((prev) => ({
      ...prev,
      playingMusicId: playlist[playingIndex + 1].id,
    }));
  };

  return {
    playPrevMusic,
    playNextMusic,
  };
}
