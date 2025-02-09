import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { AudioFile, Track } from "@/app/_types/studio";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);

  const tracks: Map<number, Track> = new Map();

  io.on("connection", (socket) => {
    console.log(`사용자 연결: ${socket.id}`);

    // 클라이언트에서 트랙 정보를 동기화 요청
    socket.on("sync-client-tracks", (clientTracks: Track[]) => {
      // console.log(
      //   `📩 [SERVER] 클라이언트 트랙 개수 동기화 요청 수신`,
      //   clientTracks,
      // );

      if (tracks.size === 0) {
        clientTracks.forEach((track) => {
          tracks.set(track.trackId, { ...track, files: [...track.files] });
        });
        // console.log(`🔄 [SERVER] 클라이언트 트랙 개수에 맞춰 동기화 완료`);
      }

      socket.emit("sync-track", Array.from(tracks.values())); // 해당 클라이언트에게 브로드캐스트
    });

    // 트랙의 files 변경 동기화 이벤트 처리
    socket.on(
      "update-track-files",
      ({
        trackId,
        updatedFiles,
      }: {
        trackId: number;
        updatedFiles: AudioFile[];
      }) => {
        // console.log(`📩 [SERVER] update-track-files 수신:`, {
        //   trackId,
        //   updatedFiles,
        // });

        if (!tracks.has(trackId)) {
          // console.error(
          //   `❌ [SERVER] 트랙(${trackId})이 tracks 맵에 존재하지 않음`,
          // );
          // console.log(
          //   "🗂 [SERVER] 현재 tracks 상태:",
          //   Array.from(tracks.entries()),
          // );
          return;
        }

        const track = tracks.get(trackId);
        if (track) {
          const prevFiles = JSON.stringify(track.files);
          const newFiles = JSON.stringify(updatedFiles);

          if (prevFiles != newFiles) {
            track.files = updatedFiles;
            // console.log(`📡 [SERVER] sync-track-files 브로드캐스트 실행:`, {
            //   trackId,
            //   updatedFiles,
            // });
            socket.broadcast.emit("sync-track-files", {
              trackId,
              updatedFiles,
            });
          } else {
            // console.log(
            //   `⚠️ [SERVER] 변경사항 없음 -> sync-track-files 브로드캐스트 생략`,
            // );
          }
        }
      },
    );

    // 커서 이동 이벤트 처리
    socket.on("cursorMove", ({ x, y, name }) => {
      // 다른 사용자들에게 커서 위치 브로드캐스트
      socket.broadcast.emit("cursorUpdate", { id: socket.id, x, y, name });
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
