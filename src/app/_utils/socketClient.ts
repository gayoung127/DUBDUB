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

// "use client";

// import { io } from "socket.io-client";

// export const socket = io();
