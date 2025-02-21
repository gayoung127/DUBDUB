package com.ssafy.dubdub.wss;

import com.ssafy.dubdub.wss.dto.ConnectedUser;
import com.ssafy.dubdub.wss.dto.StudioSessionStatus;
import com.ssafy.dubdub.wss.dto.UserSession;
import com.ssafy.dubdub.wss.dto.WebSocketStatusResponse;
import com.ssafy.dubdub.wss.repository.UserSessionRepository;
import com.ssafy.dubdub.wss.service.StudioSessionService;
import com.ssafy.dubdub.wss.service.StudioStoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.messaging.SubProtocolWebSocketHandler;

import java.io.IOException;
import java.lang.reflect.Field;
import java.security.Principal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketManager {
    private final StudioSessionService studioSessionService;
    private final UserSessionRepository userSessionRepository;
    private final StudioStoreService studioStoreService;
    private SubProtocolWebSocketHandler webSocketHandler;

    public WebSocketStatusResponse getWebSocketStatus() {
        int totalConnections = webSocketHandler.getStats().getWebSocketSessions();

        Map<String, StudioSessionStatus> studioSessions = getStudioSessionsStatus();

        return WebSocketStatusResponse.builder()
                .totalConnections(totalConnections)
                .studioSessions(studioSessions)
                .timestamp(getCurrentTimestamp())
                .build();
    }

    private Map<String, StudioSessionStatus> getStudioSessionsStatus() {
        Map<String, List<UserSession>> studioSessionMap = new HashMap<>();
        userSessionRepository.findAll().forEach(user -> {
            studioSessionMap.computeIfAbsent(user.getSessionId(), k -> new ArrayList<>()).add(user);
        });

        Map<String, WebSocketSession> activeWebSocketSessions = getActiveWebSocketSessions();

        return studioSessionMap.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> createStudioSessionStatus(entry.getKey(), entry.getValue(), activeWebSocketSessions)
                ));
    }

    private Map<String, WebSocketSession> getActiveWebSocketSessions() {
        Map<String, WebSocketSession> sessions = new HashMap<>();
        try {
            Field sessionsField = webSocketHandler.getClass().getDeclaredField("sessions");
            sessionsField.setAccessible(true);

            @SuppressWarnings("unchecked")
            Map<String, WebSocketSession> activeSessions = (Map<String, WebSocketSession>) sessionsField.get(webSocketHandler);

            activeSessions.forEach((sessionId, session) -> {
                if (session.isOpen()) {
                    sessions.put(sessionId, session);
                }
            });
        } catch (Exception e) {
            log.error("WebSocket 세션 정보 조회 중 오류 발생", e);
        }

        return sessions;
    }

    private StudioSessionStatus createStudioSessionStatus(
            String studioSessionId,
            List<UserSession> registeredUsers,
            Map<String, WebSocketSession> activeWebSocketSessions) {

        List<ConnectedUser> activeUsers = registeredUsers.stream()
                .filter(user -> hasActiveWebSocketConnection(activeWebSocketSessions, user))
                .map(user -> createConnectedUserInfo(user, activeWebSocketSessions))
                .collect(Collectors.toList());

        return StudioSessionStatus.builder()
                .studioSessionId(studioSessionId)
                .registeredUsers(registeredUsers.size())
                .activeConnections(activeUsers.size())
                .connectedUsers(activeUsers)
                .lastActivityTime(getCurrentTimestamp())
                .build();
    }

    private boolean hasActiveWebSocketConnection(
            Map<String, WebSocketSession> webSocketSessions,
            UserSession user) {

        return webSocketSessions.values().stream()
                .anyMatch(session -> {
                    Principal principal = session.getPrincipal();
                    if (principal == null) return false;
                    return user.getMemberId().equals(principal.getName());
                });
    }

    private ConnectedUser createConnectedUserInfo(
            UserSession user,
            Map<String, WebSocketSession> webSocketSessions) {

        WebSocketSession webSocketSession = findUserWebSocketSession(webSocketSessions, user);

        return ConnectedUser.builder()
                .memberId(user.getMemberId())
                .nickName(user.getNickName())
                .email(user.getEmail())
                .profileUrl(user.getProfileUrl())
                .position(user.getPosition())
                .webSocketSessionId(webSocketSession != null ? webSocketSession.getId() : null)
                .connectionTime(webSocketSession != null ?
                        getConnectionTime(webSocketSession) : null)
                .build();
    }

    private WebSocketSession findUserWebSocketSession(
            Map<String, WebSocketSession> webSocketSessions,
            UserSession user) {

        return webSocketSessions.values().stream()
                .filter(session -> {
                    Principal principal = session.getPrincipal();
                    if (principal == null) return false;
                    return user.getMemberId().equals(principal.getName());
                })
                .findFirst()
                .orElse(null);
    }

    private Timestamp getConnectionTime(WebSocketSession session) {
        Object connectionTime = session.getAttributes().get("connectionTime");
        return connectionTime != null ? (Timestamp) connectionTime : getCurrentTimestamp();
    }

    private Timestamp getCurrentTimestamp() {
        return new Timestamp(System.currentTimeMillis());
    }

    public void closeStudioSession(String studioSessionId) {
        log.info("Studio 세션 종료 시작: {}", studioSessionId);

        try {
            List<UserSession> sessionUsers = userSessionRepository.findBySessionId(studioSessionId);

            Map<String, WebSocketSession> activeSessions = getActiveWebSocketSessions();
            sessionUsers.forEach(user -> {
                WebSocketSession webSocketSession = findUserWebSocketSession(activeSessions, user);
                if (webSocketSession != null) {
                    try {
                        webSocketSession.close();
                    } catch (IOException e) {
                        log.error("WebSocket 세션 종료 중 오류 발생: {}", e.getMessage());
                    }
                }
                studioSessionService.removeUserFromSession(studioSessionId, user.getMemberId());
            });

            studioStoreService.deleteAllBySessionId(studioSessionId);

            log.info("Studio 세션 종료 완료: {}", studioSessionId);
        } catch (Exception e) {
            log.error("Studio 세션 종료 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException("Studio 세션 종료 중 오류가 발생했습니다.", e);
        }
    }
}
