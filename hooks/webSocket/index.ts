import type { IPublishParams } from "@stomp/stompjs";
import { useSocket } from "~/contexts/Socket";
import type { Emoji } from "~/types/emoji";
import type { Playlist } from "~/types/playlist";

// 웹소켓 베이스 use hook
export const useWebSocketPublish = (
  url: string,
  params: Omit<IPublishParams, "destination">
) => {
  const { socket } = useSocket();
  const publish = async () => {
    if (socket.connected) {
      await socket.publish({
        ...params,
        destination: url,
        skipContentLengthHeader: true,
      });
    }
  };

  return { publish };
};

export const useEmoji = (roomId: number, body: Omit<Emoji, "senderId">) => {
  return useWebSocketPublish(`/app/v1/rooms/${roomId}/send-emoji`, {
    body: JSON.stringify(body),
  });
};

export const useAddPlaylistItemRequest = (
  roomId: number,
  body: Omit<Playlist, "playlistItemId">
) => {
  return useWebSocketPublish(`/app/v1/rooms/${roomId}/add-playlist-item`, {
    body: JSON.stringify(body),
  });
};
