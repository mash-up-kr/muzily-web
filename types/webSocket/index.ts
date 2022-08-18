import type { Emoji } from "~/types/emoji";
import type { Playlist } from "~/types/playlist";

export const SOCKET_RES_TYPE = {
  error: "ERROR",
  emoji: "EMOJI",
  playlistItemRequest: "PLAYLIST_ITEM_REQUEST",
  playlistItemAdd: "PLAYLIST_ITEM_ADD",
  playlistItemRequestDecline: "PLAYLIST_ITEM_REQUEST_DECLINE",
  playlistItemRemove: "PLAYLIST_ITEM_REMOVE",
  playlistItemChangeOrder: "PLAYLIST_ITEM_CHANGE_ORDER",
} as const;
type SocketResType = keyof typeof SOCKET_RES_TYPE;

export interface StompCallbackMessage {
  type: typeof SOCKET_RES_TYPE[SocketResType];
  code: string;
  message: string;
  data: Playlist | Emoji;
}
