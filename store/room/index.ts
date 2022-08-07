import produce from "immer";
import type { WritableDraft } from "immer/dist/internal";
import { atom, useRecoilState } from "recoil";
import type { SetterOrUpdater } from "recoil";
import type { Music } from "~/types/musics";

interface RoomState {
  playList: Music[];
  openAddSongScreen: boolean;
  openPlaylistScreen: boolean;
  playingMusicId: string;
  isPlaying: boolean;
}

const roomAtomState = atom<RoomState>({
  key: "room",
  default: {
    // Youtube Player
    isPlaying: false,

    // Playlist
    playList: [],
    playingMusicId: "",

    // UI
    openAddSongScreen: false,
    openPlaylistScreen: false,
  },
});

export const useRoomStore = () => {
  const [state, setState] = useRecoilState(roomAtomState);
  const actions = createActions(state, setState);

  return { state, actions };
};

function createActions(state: RoomState, setState: SetterOrUpdater<RoomState>) {
  const update = (callback: (draft: WritableDraft<RoomState>) => void) => {
    setState((prev) => produce(prev, callback));
  };

  const getMusicIndex = (id: string) => {
    const index = state.playList.findIndex((item) => item.id === id);

    return index === -1 ? 0 : index;
  };

  return {
    init(musicData: Music[]) {
      update((draft) => {
        draft.playList = musicData;
        draft.playingMusicId = musicData[0].id;
      });
    },
    setOpenAddSongScreen(isOpen: boolean) {
      update((draft) => {
        draft.openAddSongScreen = isOpen;
      });
    },
    setOpenPlaylistScreen(isOpen: boolean) {
      update((draft) => {
        draft.openPlaylistScreen = isOpen;
      });
    },

    playNextMusic() {
      const playingIndex = getMusicIndex(state.playingMusicId);
      if (playingIndex === state.playList.length - 1) {
        return null;
      }

      update((draft) => {
        draft.playingMusicId = state.playList[playingIndex + 1].id;
      });
    },

    playPrevMusic() {
      const playingIndex = getMusicIndex(state.playingMusicId);
      if (playingIndex === 0) {
        return null;
      }
      update((draft) => {
        draft.playingMusicId = state.playList[playingIndex - 1].id;
      });
    },

    setPlayingMusicId(id: string) {
      update((draft) => {
        draft.playingMusicId = id;
      });
    },

    setPlaylist(list: Music[]) {
      update((draft) => {
        draft.playList = list;
      });
    },

    setIsPlaying(isPlaying: boolean) {
      update((draft) => {
        draft.isPlaying = isPlaying;
      });
    },

    getMusicIndex,
  };
}
