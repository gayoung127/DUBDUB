package com.ssafy.dubdub.wss;

import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.security.dto.CustomUserDetails;
import com.ssafy.dubdub.util.SecurityUtil;
import com.ssafy.dubdub.wss.dto.UserSession;
import com.ssafy.dubdub.wss.repository.UserSessionRepository;
import com.ssafy.dubdub.wss.service.StudioSessionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Timer;
import java.util.TimerTask;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);
    private final StudioSessionService studioSessionService;
    private final UserSessionRepository userSessionRepository;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) accessor.getUser();

        if (auth != null) {
            CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
            Member user = userDetails.getMember();
            String sessionId = accessor.getFirstNativeHeader("sessionId");
            logger.info("사용자 연결: {}", sessionId);

            // 사용자 정보 추가
            UserSession userSession = UserSession.builder()
                    .sessionId(sessionId)
                    .email(user.getEmail())
                    .memberId(user.getId().toString())
                    .nickName(user.getNickname())
                    .position(user.getPosition().toString())
                    .profileUrl(user.getProfileUrl())
                    .build();

            new Timer().schedule(new TimerTask() {
                @Override
                public void run() {
                    studioSessionService.addUserToSession(sessionId, userSession);
                }
            }, 1000);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) accessor.getUser();
        if (auth != null) {
            CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
            Member user = userDetails.getMember();

            UserSession userSession = userSessionRepository.findByMemberId(user.getId().toString());
            if (userSession != null) {
                String sessionId = userSession.getSessionId();
                logger.info("사용자 연결 해제: {}", sessionId);
                studioSessionService.removeUserFromSession(sessionId, userSession.getMemberId());
            } else {
                logger.debug("이미 연결이 해제된 사용자입니다. memberId: {}", user.getId().toString());
            }
        }
    }
}