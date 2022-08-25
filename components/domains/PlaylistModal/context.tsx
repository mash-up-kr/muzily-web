import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext } from "react";

type Context = {
  isDeletingMode: boolean;
  setIsDeletingMode: Dispatch<SetStateAction<boolean>>;
  deletingIds: number[];
  setDeletingIds: Dispatch<SetStateAction<number[]>>;
};

export const PlaylistContext = createContext({} as Context);

export const usePlaylistContext = () => useContext(PlaylistContext);
