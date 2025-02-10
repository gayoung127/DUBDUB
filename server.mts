import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { AudioFile, Track } from "@/app/_types/studio";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "4000", 10);

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
      console.log(
        `📩 [SERVER] 클라이언트 트랙 개수 동기화 요청 수신`,
        clientTracks,
      );

      if (tracks.size === 0) {
        clientTracks.forEach((track) => {
          tracks.set(track.trackId, { ...track, files: [...track.files] });
        });
        console.log(`🔄 [SERVER] 클라이언트 트랙 개수에 맞춰 동기화 완료`);
      }
      console.log("싱크");

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

    //

    // 트랙의 mute 요청 처리
    socket.on(
      "mute-track",
      ({ trackId, newIsMuted }: { trackId: number; newIsMuted: boolean }) => {
        console.log("요청 들어옴 ㅠㅠ");
        const track = tracks.get(trackId);
        if (!track) {
          console.error(`트랙(${trackId})이 tracks 맵에 존재하지 않음,,`);
          return;
        }
        console.log("new is muted= ", newIsMuted);

        track.isMuted = newIsMuted; // 해당 트랙의 mute 상태 변경

        console.log(
          `트랙(${trackId})의 mute 상태가 ${newIsMuted ? "활성화" : "비활성화"}됨!!!!!`,
        );

        io.emit("track-muted", { trackId, newIsMuted });
        console.log("📡 track-muted 이벤트 브로드캐스트 실행:", {
          trackId,
          newIsMuted,
        });

        // socket.broadcast.emit("track-muted", { trackId, isMuted }); // 다른 클라이언트에 브로드캐스트
      },
    );

    // 트랙의 solo 요청 처리
    socket.on("solo-track", ({ trackId }: { trackId: number }) => {
      console.log("track id= ", trackId);
      const soloTrack = tracks.get(trackId);
      if (!soloTrack) {
        console.error(`트랙(${trackId})이 tracks 맵에 존재하지 않음!!`);
        return;
      }

      tracks.forEach((track, id) => {
        track.isMuted = id !== trackId; // solo 트랙 외 모든 트랙 mute
      });

      console.log(`트랙(${trackId})이 solo 상태로 설정됨`);
      io.emit("track-solo", {
        soloTrackId: trackId,
        updatedTracks: Array.from(tracks.values()), // 업데이트된 트랙 상태를 전송
      });
    });

    //
  });

  httpServer.listen(port, () => {
    console.log(`서버 실행 중 : http://${hostname}:${port}`);
  });
});
