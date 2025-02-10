var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
var dev = process.env.NODE_ENV !== "production";
var hostname = process.env.HOSTNAME || "localhost";
var port = parseInt(process.env.PORT || "4000", 10);
var app = next({ dev: dev, hostname: hostname, port: port });
var handle = app.getRequestHandler();
app.prepare().then(function () {
    var httpServer = createServer(handle);
    var io = new Server(httpServer);
    var tracks = new Map();
    io.on("connection", function (socket) {
        console.log("\uC0AC\uC6A9\uC790 \uC5F0\uACB0: ".concat(socket.id));
        // 클라이언트에서 트랙 정보를 동기화 요청
        socket.on("sync-client-tracks", function (clientTracks) {
            console.log("\uD83D\uDCE9 [SERVER] \uD074\uB77C\uC774\uC5B8\uD2B8 \uD2B8\uB799 \uAC1C\uC218 \uB3D9\uAE30\uD654 \uC694\uCCAD \uC218\uC2E0", clientTracks);
            if (tracks.size === 0) {
                clientTracks.forEach(function (track) {
                    tracks.set(track.trackId, __assign(__assign({}, track), { files: __spreadArray([], track.files, true) }));
                });
                console.log("\uD83D\uDD04 [SERVER] \uD074\uB77C\uC774\uC5B8\uD2B8 \uD2B8\uB799 \uAC1C\uC218\uC5D0 \uB9DE\uCDB0 \uB3D9\uAE30\uD654 \uC644\uB8CC");
            }
            console.log("싱크");
            socket.emit("sync-track", Array.from(tracks.values())); // 해당 클라이언트에게 브로드캐스트
        });
        // 트랙의 files 변경 동기화 이벤트 처리
        socket.on("update-track-files", function (_a) {
            // console.log(`📩 [SERVER] update-track-files 수신:`, {
            //   trackId,
            //   updatedFiles,
            // });
            var trackId = _a.trackId, updatedFiles = _a.updatedFiles;
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
            var track = tracks.get(trackId);
            if (track) {
                var prevFiles = JSON.stringify(track.files);
                var newFiles = JSON.stringify(updatedFiles);
                if (prevFiles != newFiles) {
                    track.files = updatedFiles;
                    // console.log(`📡 [SERVER] sync-track-files 브로드캐스트 실행:`, {
                    //   trackId,
                    //   updatedFiles,
                    // });
                    socket.broadcast.emit("sync-track-files", {
                        trackId: trackId,
                        updatedFiles: updatedFiles,
                    });
                }
                else {
                    // console.log(
                    //   `⚠️ [SERVER] 변경사항 없음 -> sync-track-files 브로드캐스트 생략`,
                    // );
                }
            }
        });
        // 커서 이동 이벤트 처리
        socket.on("cursorMove", function (_a) {
            var x = _a.x, y = _a.y, name = _a.name;
            // 다른 사용자들에게 커서 위치 브로드캐스트
            socket.broadcast.emit("cursorUpdate", { id: socket.id, x: x, y: y, name: name });
        });
        // 사용자 연결 종료 처리
        socket.on("disconnect", function () {
            console.log("\uC0AC\uC6A9\uC790 \uC5F0\uACB0 \uC885\uB8CC: ".concat(socket.id));
            // 사용자 제거 이벤트 전송
            socket.broadcast.emit("cursorRemove", socket.id);
            console.log("Broadcasted cursorRemove event for ".concat(socket.id));
        });
        //
        // 트랙의 mute 요청 처리
        socket.on("mute-track", function (_a) {
            var trackId = _a.trackId, newIsMuted = _a.newIsMuted;
            console.log("요청 들어옴 ㅠㅠ");
            var track = tracks.get(trackId);
            if (!track) {
                console.error("\uD2B8\uB799(".concat(trackId, ")\uC774 tracks \uB9F5\uC5D0 \uC874\uC7AC\uD558\uC9C0 \uC54A\uC74C,,"));
                return;
            }
            console.log("new is muted= ", newIsMuted);
            track.isMuted = newIsMuted; // 해당 트랙의 mute 상태 변경
            console.log("\uD2B8\uB799(".concat(trackId, ")\uC758 mute \uC0C1\uD0DC\uAC00 ").concat(newIsMuted ? "활성화" : "비활성화", "\uB428!!!!!"));
            io.emit("track-muted", { trackId: trackId, newIsMuted: newIsMuted });
            console.log("📡 track-muted 이벤트 브로드캐스트 실행:", {
                trackId: trackId,
                newIsMuted: newIsMuted,
            });
            // socket.broadcast.emit("track-muted", { trackId, isMuted }); // 다른 클라이언트에 브로드캐스트
        });
        // 트랙의 solo 요청 처리
        socket.on("solo-track", function (_a) {
            var trackId = _a.trackId;
            console.log("track id= ", trackId);
            var soloTrack = tracks.get(trackId);
            if (!soloTrack) {
                console.error("\uD2B8\uB799(".concat(trackId, ")\uC774 tracks \uB9F5\uC5D0 \uC874\uC7AC\uD558\uC9C0 \uC54A\uC74C!!"));
                return;
            }
            tracks.forEach(function (track, id) {
                track.isMuted = id !== trackId; // solo 트랙 외 모든 트랙 mute
            });
            console.log("\uD2B8\uB799(".concat(trackId, ")\uC774 solo \uC0C1\uD0DC\uB85C \uC124\uC815\uB428"));
            io.emit("track-solo", {
                soloTrackId: trackId,
                updatedTracks: Array.from(tracks.values()), // 업데이트된 트랙 상태를 전송
            });
        });
        //
    });
    httpServer.listen(port, function () {
        console.log("\uC11C\uBC84 \uC2E4\uD589 \uC911 : http://".concat(hostname, ":").concat(port));
    });
});
