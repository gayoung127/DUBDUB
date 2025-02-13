package com.ssafy.dubdub.wss;

import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.util.SecurityUtil;
import com.ssafy.dubdub.wss.dto.UserSession;
import com.ssafy.dubdub.wss.repository.UserSessionRepository;
import com.ssafy.dubdub.wss.service.StudioSessionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);
    private final StudioSessionService studioSessionService;
    private final UserSessionRepository userSessionRepository;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        Member user = SecurityUtil.getCurrentUser();
        if (user != null) {
            StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
            String sessionId = accessor.getFirstNativeHeader("sessionId");
            logger.info("사용자 연결: {}", sessionId);

            // 사용자 정보 추가
            UserSession userSession = UserSession.builder()
                    .userSessionId(user.getId())
                    .sessionId(sessionId)
                    .email(user.getEmail())
                    .memberId(user.getId().toString())
                    .nickName(user.getNickname())
                    .position(user.getPosition().toString())
                    .profileUrl(user.getProfileUrl())
                    .build();

            studioSessionService.addUserToSession(sessionId, userSession);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        Member user = SecurityUtil.getCurrentUser();
        if (user != null) {
            UserSession userSession = userSessionRepository.findByUserSessionId(user.getId());
            String sessionId = userSession.getSessionId();
            logger.info("사용자 연결 해제: {}", sessionId);

            // 세션에서 사용자 제거
            studioSessionService.removeUserFromSession(sessionId, userSession.getUserSessionId());
        }
    }
}