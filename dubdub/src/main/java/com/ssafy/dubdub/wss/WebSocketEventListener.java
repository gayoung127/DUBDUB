package com.ssafy.dubdub.wss;

import com.ssafy.dubdub.util.SecurityUtil;
import com.ssafy.dubdub.wss.dto.UserSession;
import com.ssafy.dubdub.wss.service.StudioSessionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);
    private final StudioSessionService studioSessionService;
    private final SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        SecurityUtil.getCurrentUser();
        Principal user = event.getUser();
        if (user != null) {
            String sessionId = user.getName(); // 세션 ID 가져오기 (보통 userId 또는 unique 값)
            logger.info("사용자 연결: {}", sessionId);

            // 사용자 정보 추가
            UserSession userSession = new UserSession();
            studioSessionService.addUserToSession(sessionId, userSession);

            // 모든 사용자에게 변경된 참여자 목록 전송
            messagingTemplate.convertAndSend("/topic/studio/" + sessionId + "/users", studioSessionService.getUsersInSession(sessionId));
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        Principal user = event.getUser();
        if (user != null) {
            String sessionId = user.getName();
            logger.info("사용자 연결 해제: {}", sessionId);

            // 세션에서 사용자 제거
            studioSessionService.removeUserFromSession(sessionId, sessionId);

            // 변경된 참여자 목록 전송
            messagingTemplate.convertAndSend("/topic/studio/" + sessionId + "/users", studioSessionService.getUsersInSession(sessionId));
        }
    }
}