import type { Emoji, PlaylistItem } from "~/types";

export const SOCKET_RES_TYPE = {
  error: "ERROR",
  emoji: "EMOJI",
  playlistItemRequest: "PLAYLIST_ITEM_REQUEST",
  playlistItemAdd: "PLAYLIST_ITEM_ADD",
  playlistItemRequestDecline: "PLAYLIST_ITEM_REQUEST_DECLINE",
  playlistItemRemove: "PLAYLIST_ITEM_REMOVE",
  playlistItemChangeOrder: "PLAYLIST_ITEM_CHANGE_ORDER",
  playInformationUpdate: "PLAY_INFORMATION_UPDATE",
} as const;
type SocketResType = typeof SOCKET_RES_TYPE;

export type StompCallbackMessage =
  | {
      type: SocketResType["error"];
      code: string;
      message: string;
      data: null;
    }
  | {
      type: SocketResType["emoji"];
      code: string;
      message: string;
      data: Emoji;
    }
  | {
      type:
        | SocketResType["playlistItemRequest"]
        | SocketResType["playlistItemAdd"];
      code: string;
      message: string;
      data: PlaylistItem;
    }
  | {
      type: SocketResType["playlistItemChangeOrder"];
      code: string;
      message: string;
      data: {
        playlistId: number;
        playlistItemId: number;
        order: number[];
      };
    }
  | {
      type: SocketResType["playInformationUpdate"];
      code: string;
      message: string;
      data: {
        playlistId: number;
        playlistItemId: number;
        playStatus: "PLAY" | "PAUSE";
      };
    }
  | {
      type: SocketResType["playlistItemRequestDecline"];
      code: string;
      message: string;
      data: {
        playlistItemId: number;
      };
    }
  | {
      type: SocketResType["playlistItemRemove"];
      code: string;
      message: string;
      data: {
        playlistId: number;
        playlistItemId: number;
      };
    };
