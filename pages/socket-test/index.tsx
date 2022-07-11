/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import { Client } from "@stomp/stompjs";
import type { IStompSocket, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface ChatContent {
  chat: string;
}

interface StompCallbackMessage {
  type: "CHAT" | "ERROR";
  code: string;
  message: string;
  data: ChatContent | null;
}

interface Chat {
  chat: string;
}

const STOMP_SERVER_URL = process.env
  .NEXT_PUBLIC_SERVER_STOMP_END_POINT as string;
const ROOM_ID = 1; // For test

const client = new Client();

client.configure({
  brokerURL: STOMP_SERVER_URL,
  connectHeaders: {
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
  client.webSocketFactory = () => {
    return new SockJS(STOMP_SERVER_URL) as IStompSocket;
  };
}

const SocketTestPage: NextPage = () => {
  const [chat, setChat] = useState<Chat[]>([]);
  const [value, setValue] = useState("");

  const subscribe = () => {
    client.subscribe(`/sub/v1/rooms/${ROOM_ID}`, (message: IMessage) => {
      if (message.body) {
        const newMessage: StompCallbackMessage = JSON.parse(message.body);
        console.log("newMessage", newMessage);
        if (newMessage.type === "CHAT" && newMessage.data?.chat !== undefined) {
          chat.push(newMessage.data);
          setChat([...chat]);
        }
      } else {
        console.error("got empty message");
      }
    });
    client.subscribe("/user/queue/errors", (message: IMessage) => {
      console.error("error message", message);
      if (message.body) {
        const newMessage: StompCallbackMessage = JSON.parse(message.body);
        if (newMessage.type === "ERROR") {
          console.error(newMessage.message);
        }
      } else {
        console.error("got empty message");
      }
    });
  };

  const connect = () => {
    client.onConnect = (frame) => {
      console.log("connect!");
      console.debug("connect", frame);
      subscribe();
    };

    client.onStompError = (frame) => {
      console.debug(`Broker reported error: ${frame.headers.message}`);
      console.debug(`Additional details: ${frame.body}`);
    };

    client.activate();
  };

  const disConnect = () => {
    if (client.connected) {
      client.deactivate();
    }
  };

  const handleChat = (message: string) => {
    console.log("client", client, client.connected);
    if (!client.connected) {
      console.error("Stomp client is not connected");

      return;
    }
    client.publish({
      destination: `/pub/v1/rooms/${ROOM_ID}/send-chat`,
      body: JSON.stringify({
        chat: message,
      }),
      skipContentLengthHeader: true,
    });
  };

  useEffect(() => {
    connect();

    return () => disConnect();
  }, []);

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={() => handleChat(value)}>전송</button>
      {chat.map((v, i) => (
        <div key={i}>{v.chat}</div>
      ))}
    </div>
  );
};

export default SocketTestPage;
