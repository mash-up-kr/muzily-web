import type { Room } from "../rooms";

export interface PlaylistItem {
  id: number;
  playlistId: number;
  videoId: string;
  title: string;
  thumbnail: string;
  duration: number;
  dominantColor: string;
}

export type Playlist = PlaylistItem[];

export type PlaylistReponse = {
  playlistId: number;
  order: PlaylistItem["playlistId"][];
  playlistItems: PlaylistItem[];
  roomId: Room["roomId"];
};

export type AddPlaylistRequestBody = Omit<PlaylistItem, "id">;

export type PlaylistItemRequest = {
  playlistId: number;
  playlistItemIds: number[];
};
