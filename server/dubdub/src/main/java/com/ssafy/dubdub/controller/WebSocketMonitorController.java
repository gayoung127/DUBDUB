package com.ssafy.dubdub.controller;

import com.ssafy.dubdub.wss.WebSocketManager;
import com.ssafy.dubdub.wss.dto.WebSocketStatusResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/websocket")
@RequiredArgsConstructor
public class WebSocketMonitorController {
    private final WebSocketManager webSocketManager;

    /**
     * 현재 WebSocket 연결 상태를 모니터링합니다.
     * - 전체 연결 수
     * - 스튜디오 세션별 상태
     * - 연결된 사용자 정보
     */
    @Operation(summary = "WebSocket 연결 상태 확인")
    @GetMapping("/status")
    public ResponseEntity<WebSocketStatusResponse> getWebSocketStatus() {
        return ResponseEntity.ok(webSocketManager.getWebSocketStatus());
    }

    /**
     * 특정 스튜디오 세션을 명시적으로 종료합니다.
     * 연결된 모든 WebSocket을 종료하고 관련 리소스를 정리합니다.
     */
    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<Void> closeStudioSession(
            @PathVariable String sessionId) {
        webSocketManager.closeStudioSession(sessionId);
        return ResponseEntity.ok().build();
    }
}
