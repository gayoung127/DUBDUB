import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(`사용자 연결: ${socket.id}`);

    // 커서 이동 이벤트 처리
    socket.on("cursorMove", ({ x, y, name }) => {
      console.log(
        `Cursor move received from client (${socket.id}): x=${x}, y=${y} name=${name}`,
      );

      // 다른 사용자들에게 커서 위치 브로드캐스트
      socket.broadcast.emit("cursorUpdate", { id: socket.id, x, y, name });
      console.log(
        `Broadcasted cursorUpdate event for ${socket.id}: x=${x}, y=${y}, name=${name}`,
      );
    });

    // 사용자 연결 종료 처리
    socket.on("disconnect", () => {
      console.log(`사용자 연결 종료: ${socket.id}`);

      // 사용자 제거 이벤트 전송
      socket.broadcast.emit("cursorRemove", socket.id);
      console.log(`Broadcasted cursorRemove event for ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`서버 실행 중 : http://${hostname}:${port}`);
  });
});
