package com.ssafy.dubdub.wss.service;

import com.ssafy.dubdub.wss.dto.UserSession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class StudioSessionService {
    private final RedisTemplate<String, UserSession> redisTemplate;
    private static final String PREFIX = "studio:";

    // 사용자를 세션에 추가
    public void addUserToSession(String sessionId, UserSession userSession) {
        String key = PREFIX + sessionId;
        redisTemplate.opsForList().rightPush(key, userSession);

        // TTL (예: 60분 후 자동 삭제)
        redisTemplate.expire(key, 60, TimeUnit.MINUTES);
    }

    // 사용자를 세션에서 제거
    public void removeUserFromSession(String sessionId, String userId) {
        String key = PREFIX + sessionId;
        List<UserSession> users = redisTemplate.opsForList().range(key, 0, -1);
        if (users != null) {
            users.removeIf(user -> user.getId().equals(userId));
            redisTemplate.delete(key);
            users.forEach(user -> redisTemplate.opsForList().rightPush(key, user));
        }
    }

    // 현재 참여 중인 사용자 목록 반환
    public List<UserSession> getUsersInSession(String sessionId) {
        return redisTemplate.opsForList().range(PREFIX + sessionId, 0, -1);
    }
}
