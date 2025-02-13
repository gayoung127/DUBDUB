package com.ssafy.dubdub.wss.controller;

import com.ssafy.dubdub.domain.entity.Member;
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
        Member user = SecurityUtil.getCurrentUser();
        if (user != null) {
            String sessionId = user.getId().toString(); // 세션 ID 가져오기 (member식별 userId)
            logger.info("사용자 연결: {}", sessionId);

            // 사용자 정보 추가
            UserSession userSession = UserSession.builder()
                    .id(user.getId().toString())
                    .sessionId(sessionId)
                    .name(user.getNickname())
                    .role(user.getPosition().toString())
                    .profileUrl(user.getProfileUrl())
                    .build();

            studioSessionService.addUserToSession(sessionId, userSession);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        Member user = SecurityUtil.getCurrentUser();
        if (user != null) {
            String sessionId = user.getId().toString();
            logger.info("사용자 연결 해제: {}", sessionId);

            // 세션에서 사용자 제거
            studioSessionService.removeUserFromSession(sessionId, user.getId().toString());
        }
    }
}