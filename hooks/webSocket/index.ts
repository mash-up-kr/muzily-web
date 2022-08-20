import type { IPublishParams } from "@stomp/stompjs";
import { useRoomSocket } from "~/contexts/RoomSocket";
import type { Emoji } from "~/types/emoji";
import type { PlaylistItem } from "~/types/playlist";

// 웹소켓 베이스 use hook
export const useWebSocketPublish = <Body extends { [x: string]: any }>(
  url: string,
  defaultParams: Omit<IPublishParams, "destination"> = {}
) => {
  const { socket } = useRoomSocket();
  const publish = async (body?: Body) => {
    if (socket.connected) {
      await socket.publish({
        ...defaultParams,
        body: body ? JSON.stringify(body) : defaultParams.body,
        destination: url,
        skipContentLengthHeader: true,
      });
    }
  };

  return { publish };
};

type EmojiBody = Omit<Emoji, "senderId">;
export const useEmoji = (roomId: number, body: EmojiBody) =>
  useWebSocketPublish<EmojiBody>(`/app/v1/rooms/${roomId}/send-emoji`, {
    body: JSON.stringify(body),
  });

type PlaylistBody = Omit<PlaylistItem, "playlistItemId">;
export const useAddPlaylistItemRequest = (roomId: number, body: PlaylistBody) =>
  useWebSocketPublish<PlaylistBody>(
    `/app/v1/rooms/${roomId}/add-playlist-item`,
    { body: JSON.stringify(body) }
  );
