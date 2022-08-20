import type { IPublishParams } from "@stomp/stompjs";
import { useRoomSocket } from "~/contexts/RoomSocket";
import type { Emoji } from "~/types/emoji";
import type { PlaylistItem } from "~/types/playlist";

// 웹소켓 베이스 use hook
export const useWebSocketPublish = (
  url: string,
  params: Omit<IPublishParams, "destination">
) => {
  const { socket } = useRoomSocket();
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
  body: Omit<PlaylistItem, "playlistItemId">
) => {
  return useWebSocketPublish(`/app/v1/rooms/${roomId}/add-playlist-item`, {
    body: JSON.stringify(body),
  });
};
