import type { IPublishParams } from "@stomp/stompjs";
import { useRoomSocket } from "~/contexts/RoomSocket";
import type { Emoji, AddPlaylistRequestBody } from "~/types";

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

export const useAddPlaylistItemRequest = (
  roomId: number,
  body: AddPlaylistRequestBody
) =>
  useWebSocketPublish<AddPlaylistRequestBody>(
    `/app/v1/rooms/${roomId}/add-playlist-item`,
    { body: JSON.stringify(body) }
  );

type ChangePlaylistItemOrderBody = {
  playlistId: number;
  prevPlaylistItemIdToMove: number;
  playlistItemId: number;
};

export const useChangePlaylistOrder = (
  roomId: number,
  body: ChangePlaylistItemOrderBody
) =>
  useWebSocketPublish<ChangePlaylistItemOrderBody>(
    `/app/v1/rooms/${roomId}/change-order-playlist-item`,
    { body: JSON.stringify(body) }
  );
