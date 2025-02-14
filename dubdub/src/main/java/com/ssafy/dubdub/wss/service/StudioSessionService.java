package com.ssafy.dubdub.wss.service;

import com.ssafy.dubdub.service.StudioService;
import com.ssafy.dubdub.wss.dto.UserSession;
import com.ssafy.dubdub.wss.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudioSessionService {
    private final UserSessionRepository userSessionRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final StudioService studioService;

    // 사용자를 세션에 추가
    public void addUserToSession(String sessionId, UserSession userSession) {
        userSessionRepository.save(userSession);
        notifySessionUpdate(sessionId);
    }

    // 사용자를 세션에서 제거
    public void removeUserFromSession(String sessionId, String memberId) {
        userSessionRepository.deleteById(memberId);
        List<UserSession> remainingUsers = getUsersInSession(sessionId);

        // 참여자가 없으면 스튜디오 종료
        if (remainingUsers.isEmpty()) {
            studioService.closeStudioIfEmpty(sessionId);
        }

        notifySessionUpdate(sessionId);
    }

    // 현재 참여 중인 사용자 목록 반환
    public List<UserSession> getUsersInSession(String sessionId) {
        return userSessionRepository.findBySessionId(sessionId);
    }

    // 참여자 목록 변경을 모든 클라이언트에게 알림
    private void notifySessionUpdate(String sessionId) {
        List<UserSession> users = getUsersInSession(sessionId);
        log.info(users.toString());
        messagingTemplate.convertAndSend("/topic/studio/" + sessionId + "/users", users);
    }
}
