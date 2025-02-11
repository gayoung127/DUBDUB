"use client";

import { Client } from "@stomp/stompjs";

export const stompClient = new Client({
  brokerURL: "http://i12a801.p.ssafy.io:8081/ws-studio", // STOMP 서버 URL
  connectHeaders: {},
  debug: (str) => {
    console.log("STOMP Debug:", str); // 디버그 정보 출력
  },
  onConnect: () => {
    console.log("✅ STOMP WebSocket Connected!");
  },
  onStompError: (frame) => {
    console.error("❌ STOMP Broker Error:", frame.headers["message"]);
  },
});

// STOMP 클라이언트 활성화 (연결 시작)
stompClient.activate();

// STOMP 클라이언트 비활성화 (언마운트 시 처리)
export const disconnectStompClient = () => {
  if (stompClient.connected) {
    stompClient.deactivate();
    console.log("✅ STOMP WebSocket Disconnected");
  }
};

// "use client";

// import { io } from "socket.io-client";

// export const socket = io();
