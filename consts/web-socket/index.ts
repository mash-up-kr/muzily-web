export const SOCKET_RES_TYPE = {
  emoji: "EMOJI",
  playlistItemRequest: "PLAYLIST_ITEM_REQUEST",
  playlistItemAdd: "PLAYLIST_ITEM_ADD",
  playlistItemRequestDecline: "PLAYLIST_ITEM_REQUEST_DECLINE",
  playlistItemRemove: "PLAYLIST_ITEM_REMOVE",
  playlistItemChangeOrder: "PLAYLIST_ITEM_CHANGE_ORDER",
} as const;
export type SocketResType = keyof typeof SOCKET_RES_TYPE;
