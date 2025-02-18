package com.ssafy.dubdub.wss;

import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.repository.MemberRepository;
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

import java.security.Principal;
import java.util.Timer;
import java.util.TimerTask;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);
    private final StudioSessionService studioSessionService;
    private final UserSessionRepository userSessionRepository;
    private final MemberRepository memberRepository;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal principal = accessor.getUser();

        if (principal != null) {
            String memberId = principal.getName();
            Member member = memberRepository.findById(Long.parseLong(memberId))
                    .orElseThrow(() -> new RuntimeException("Member not found"));

            String sessionId = accessor.getFirstNativeHeader("sessionId");
            logger.info("사용자 연결: {}", sessionId);

            UserSession userSession = UserSession.builder()
                    .sessionId(sessionId)
                    .email(member.getEmail())
                    .memberId(member.getId().toString())
                    .nickName(member.getNickname())
                    .position(member.getPosition().toString())
                    .profileUrl(member.getProfileUrl())
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
        Principal principal = accessor.getUser();

        if (principal != null) {
            String memberId = principal.getName();
            Member member = memberRepository.findById(Long.parseLong(memberId))
                    .orElseThrow(() -> new RuntimeException("Member not found"));

            UserSession userSession = userSessionRepository.findByMemberId(member.getId().toString());
            if (userSession != null) {
                String sessionId = userSession.getSessionId();
                logger.info("사용자 연결 해제: {}", sessionId);
                studioSessionService.removeUserFromSession(sessionId, userSession.getMemberId());
            } else {
                logger.debug("이미 연결이 해제된 사용자입니다. memberId: {}", member.getId().toString());
            }
        }
    }
}