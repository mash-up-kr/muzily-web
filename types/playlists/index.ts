import type { Room } from "../rooms";

export interface PlaylistItem {
  playlistItemId: number;
  playlistId: number;
  videoId: string;
  title: string;
  thumbnail: string;
  duration: number;
  dominantColor: string;
  createdAt: string;
  updatedAt: string;
}

export type Playlist = PlaylistItem[];

export type PlaylistResponse = {
  playlistId: number;
  order: PlaylistItem["playlistId"][];
  playlistItems: PlaylistItem[];
  roomId: Room["roomId"];
};

export type AddPlaylistRequestBody = Omit<
  PlaylistItem,
  "playlistItemId" | "createdAt" | "updatedAt"
>;

export type PlaylistItemRequest = {
  playlistId: number;
  playlistItemId: number;
};

export type RemovePlaylistItemRequest = {
  playlistId: number;
  playlistItemIds: number[];
};
