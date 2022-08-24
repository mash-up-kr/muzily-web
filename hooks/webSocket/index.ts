import type { IPublishParams } from "@stomp/stompjs";
import { useRoomSocket } from "~/contexts/RoomSocket";
import type {
  Emoji,
  AddPlaylistRequestBody,
  PlaylistItemRequest,
} from "~/types";

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
/** 이모지 웹소켓 요청 */
export const useEmoji = (roomId: number, body: EmojiBody) =>
  useWebSocketPublish<EmojiBody>(`/app/v1/rooms/${roomId}/send-emoji`, {
    body: JSON.stringify(body),
  });

/** (방장) 플레이리스트 곡 추가 웹소켓 요청 */
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

/** (방장) 플레이리스트 순서변경 웹소켓 요청 */
export const useChangePlaylistOrder = (
  roomId: number | undefined,
  body: ChangePlaylistItemOrderBody
) =>
  useWebSocketPublish<ChangePlaylistItemOrderBody>(
    `/app/v1/rooms/${roomId}/change-order-playlist-item`,
    { body: JSON.stringify(body) }
  );

type PlayerStateRequestBody = {
  playlistId: number;
  playlistItemId: number;
  playStatus: "PLAY" | "PAUSE";
};

/** 재생상태 변경 웹소켓 요청 */
export const useUpdatePlayerState = (roomId: number) =>
  useWebSocketPublish<PlayerStateRequestBody>(
    `/app/v1/rooms/${roomId}/update-play-information`
  );

/** (손님) 곡 신청 웹소켓 요청 */
export const useSendPlaylistItemRequest = (
  roomId: number,
  body: AddPlaylistRequestBody
) =>
  useWebSocketPublish<AddPlaylistRequestBody>(
    `/app/v1/rooms/${roomId}/send-playlist-item-request`,
    { body: JSON.stringify(body) }
  );

/** (방장) 곡 신청 수락 웹소켓 요청 */
export const useAcceptPlaylistItemRequest = (
  roomId: number,
  body: PlaylistItemRequest
) =>
  useWebSocketPublish(`/app/v1/rooms/${roomId}/accept-playlist-item-request`, {
    body: JSON.stringify(body),
  });

/** (방장) 곡 신청 거절 웹소켓 요청 */
export const useDeclinePlaylistItemRequest = (
  roomId: number,
  body: PlaylistItemRequest
) =>
  useWebSocketPublish(`/app/v1/rooms/${roomId}/decline-playlist-item-request`, {
    body: JSON.stringify(body),
  });

/** (방장) 플레이리스트 곡 삭제 웹소켓 요청 */
export const useRemovePlaylistItem = (
  roomId: number,
  body: PlaylistItemRequest
) => useWebSocketPublish(`/app/v1/rooms/${roomId}/remove-playlist-item`);
