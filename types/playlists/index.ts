import type { Room } from "../rooms";

export interface PlaylistItem {
  id: number;
  playlistId: number;
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;
  dominantColor: string;
}

export interface Playlist {
  id: number;
  order: PlaylistItem["id"][];
  playlistItems: PlaylistItem[];
  roomId: Room["roomId"];
}
