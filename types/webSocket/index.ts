import type { Emoji } from "~/types/emoji";
import type { PlaylistItem } from "~/types/playlist";

export const SOCKET_RES_TYPE = {
  error: "ERROR",
  emoji: "EMOJI",
  playlistItemRequest: "PLAYLIST_ITEM_REQUEST",
  playlistItemAdd: "PLAYLIST_ITEM_ADD",
  playlistItemRequestDecline: "PLAYLIST_ITEM_REQUEST_DECLINE",
  playlistItemRemove: "PLAYLIST_ITEM_REMOVE",
  playlistItemChangeOrder: "PLAYLIST_ITEM_CHANGE_ORDER",
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
    };
