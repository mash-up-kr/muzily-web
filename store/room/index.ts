import produce from "immer";
import type { WritableDraft } from "immer/dist/internal";
import { atom, useRecoilState } from "recoil";
import type { SetterOrUpdater } from "recoil";
import type { Mood, Playlist, PlaylistItem } from "~/types";

export const roomIdAtomState = atom<number>({
  key: "roomId",
  default: 0,
});

export const playlistIdAtomState = atom<number>({
  key: "playlistId",
  default: 0,
});

export interface PlayerState {
  playingMusicId: number;
  isPlaying: boolean;
}

export const playerAtomState = atom<PlayerState>({
  key: "player",
  default: {
    playingMusicId: -1,
    isPlaying: false,
  },
});

export const isHostAtomState = atom<boolean>({
  key: "isHost",
  default: false,
});

interface RoomState {
  proposedMusicList: Playlist;
  mood: Mood;
}

const roomAtomState = atom<RoomState>({
  key: "room",
  default: {
    // Youtube Player

    // Playlist
    proposedMusicList: [],

    // Mood
    mood: {
      emojiType: "HEART",
      moodDescription: "",
    },
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
    init(musicData: Playlist, isHost: boolean, mood: Mood) {
      update((draft) => {
        draft.proposedMusicList = [];
        draft.mood = mood;
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

    setMood(mood: Mood) {
      update((draft) => {
        draft.mood = mood;
      });
    },
  };
}
