export interface PlaylistItem {
  playlistItemId: number;
  playlistId: number;
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;
  dominantColor: string;
}

export type Playlist = PlaylistItem[];
