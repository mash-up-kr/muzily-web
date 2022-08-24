/* eslint-disable no-console */
import { createContext, useContext, useEffect } from "react";
import type { IMessage, IStompSocket } from "@stomp/stompjs";
import { Client } from "@stomp/stompjs";
import { useRecoilState } from "recoil";
import SockJS from "sockjs-client";
import { isBrowser } from "~/consts";
import { emojiAtomState } from "~/store/emoji";
import {
  playlistAtomState,
  proposedPlaylistAtomState,
  removeListAtomState,
} from "~/store/playlist";
import { playerAtomState } from "~/store/room";
import type { PlaylistItem } from "~/types/playlists";
import type { StompCallbackMessage } from "~/types/webSocket";

interface InitialState {
  socket: Client;
}
const RoomSocketContext = createContext({} as InitialState);

interface Props {
  roomId: string;
  children: React.ReactNode;
}

const STOMP_SERVER_URL = process.env
  .NEXT_PUBLIC_SERVER_STOMP_END_POINT as string;
const tokenKey = process.env.NEXT_PUBLIC_LOCAL_TOKEN_KEY as string;
const localStorageToken: string | null = isBrowser
  ? JSON.parse(localStorage.getItem(tokenKey) as string)
  : null;

const socket = new Client();
socket.configure({
  brokerURL: STOMP_SERVER_URL,
  connectHeaders: {
    Authorization: `Bearer ${localStorageToken}`,
    "Content-Type": "application/json",
  },
  debug: (str) => {
    console.debug(new Date(), str);
  },
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
});

// Fallback code
if (typeof WebSocket !== "function") {
  socket.webSocketFactory = () => {
    return new SockJS(STOMP_SERVER_URL) as IStompSocket;
  };
}

const RoomSocketProvider = ({ roomId, children }: Props) => {
  const [, setProposedPlaylist] = useRecoilState(proposedPlaylistAtomState);
  const [, setEmoji] = useRecoilState(emojiAtomState);
  const [, setPlaylist] = useRecoilState(playlistAtomState);
  const [, setPlayerState] = useRecoilState(playerAtomState);
  const [, setRemoveList] = useRecoilState(removeListAtomState);

  const subscribe = () => {
    socket.subscribe(
      `/topic/v1/rooms/${roomId}`,
      (message: IMessage) => {
        if (message.body) {
          const newMessage: StompCallbackMessage = JSON.parse(message.body);
          // 메시지 타입에 따라서 상태 다르게 적용하기
          switch (newMessage.type) {
            case "ERROR":
              console.error(newMessage.code, newMessage.message);
              break;
            case "EMOJI":
              setEmoji(newMessage.data);
              break;
            case "PLAYLIST_ITEM_ADD":
              setPlaylist((_playlist) => [..._playlist, newMessage.data]);
              break;
            case "PLAYLIST_ITEM_CHANGE_ORDER":
              setPlaylist((_playlist) => {
                const { order } = newMessage.data;

                const newList = order.map(
                  (id) =>
                    _playlist.find((item) => item.id === id) as PlaylistItem
                );

                return newList;
              });
              break;

            case "PLAY_INFORMATION_UPDATE":
              setPlayerState({
                isPlaying: newMessage.data.playStatus === "PLAY",
                playingMusicId: newMessage.data.playlistItemId,
              });
              break;

            case "PLAYLIST_ITEM_REMOVE":
              setPlaylist((_playlist) =>
                _playlist.filter(
                  (item) => !newMessage.data.playlistItemIds.includes(item.id)
                )
              );
              setRemoveList([]);
              break;
            default:
              console.error("등록되지 않은 메시지 타입입니다.");
              break;
          }
        } else {
          console.error("got empty message");
        }
      },
      { Authorization: `Bearer ${localStorageToken}` }
    );
    socket.subscribe(
      "/user/queue",
      (message: IMessage) => {
        if (message.body) {
          const newMessage: StompCallbackMessage = JSON.parse(message.body);
          // 메시지 타입에 따라서 상태 다르게 적용하기
          switch (newMessage.type) {
            case "ERROR":
              console.error(newMessage.code, newMessage.message);
              break;
            case "PLAYLIST_ITEM_REQUEST":
              setProposedPlaylist((_playlist) => [
                ..._playlist,
                newMessage.data,
              ]);
              break;
            case "PLAYLIST_ITEM_REQUEST_DECLINE":
              setProposedPlaylist((_playlist) => [
                ..._playlist.filter(
                  (item) => item.id !== newMessage.data.playlistItemId
                ),
              ]);
              break;
            default:
              console.error("등록되지 않은 메시지 타입입니다.");
              break;
          }
        } else {
          console.error("got empty message");
        }
      },
      { Authorization: `Bearer ${localStorageToken}` }
    );
  };

  const connect = () => {
    socket.onConnect = () => {
      console.log("connect!");
      subscribe();
    };

    socket.onStompError = (frame) => {
      console.debug(`Broker reported error: ${frame.headers.message}`);
      console.debug(`Additional details: ${frame.body}`);
    };

    socket.activate();
  };

  const disConnect = () => {
    if (socket.connected) {
      socket.deactivate();
    }
  };

  useEffect(() => {
    connect();

    return () => disConnect();
  }, []);

  return (
    <RoomSocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </RoomSocketContext.Provider>
  );
};

export const useRoomSocket = () => useContext(RoomSocketContext);

export default RoomSocketProvider;
