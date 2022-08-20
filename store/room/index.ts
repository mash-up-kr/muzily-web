import produce from "immer";
import type { WritableDraft } from "immer/dist/internal";
import { atom, selector, useRecoilState } from "recoil";
import type { SetterOrUpdater } from "recoil";
import { NEW_VIDEO_LIST } from "~/assets/dummy";
import type { Playlist, PlaylistItem } from "~/types";

export const roomIdAtomState = atom<number>({
  key: "roomId",
  default: 0,
});

export const playlistIdAtomState = atom<number>({
  key: "playlistId",
  default: 0,
});

interface RoomState {
  proposedMusicList: Playlist;
  playingMusicId: string;
  isPlaying: boolean;
  isHost: boolean;
  mood: string;
}

const roomAtomState = atom<RoomState>({
  key: "room",
  default: {
    // Youtube Player
    isHost: false,
    isPlaying: false,

    // Playlist
    proposedMusicList: [],

    playingMusicId: "",

    // Mood
    mood: "",
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

  return {
    init(musicData: Playlist, isHost: boolean, mood: string) {
      update((draft) => {
        draft.proposedMusicList = NEW_VIDEO_LIST;
        draft.playingMusicId = musicData[0]?.videoId || "";
        draft.isHost = isHost;
        draft.mood = mood;
      });
    },

    setPlayingMusicId(id: string) {
      update((draft) => {
        draft.playingMusicId = id;
      });
    },

    // addToPlaylist(music: PlaylistItem) {
    //   update((draft) => {
    //     draft.playList.push(music);
    //   });
    // },

    setIsPlaying(isPlaying: boolean) {
      update((draft) => {
        draft.isPlaying = isPlaying;
      });
    },
    removeMusicFromProposedList(id: string) {
      update((draft) => {
        draft.proposedMusicList = state.proposedMusicList.filter(
          (item) => item.videoId !== id
        );
      });
    },

    addMusicToProposedList(music: PlaylistItem) {
      update((draft) => {
        draft.proposedMusicList.push(music);
      });
    },

    setIsHost(isHost: boolean) {
      update((draft) => {
        draft.isHost = isHost;
      });
    },

    setMood(mood: string) {
      update((draft) => {
        draft.mood = mood;
      });
    },
  };
}
