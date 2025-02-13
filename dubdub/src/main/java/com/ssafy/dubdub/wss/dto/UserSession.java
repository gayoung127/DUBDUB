package com.ssafy.dubdub.wss.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.redis.core.RedisHash;

@RedisHash(value = "user_session", timeToLive = 86400)
@Getter
@AllArgsConstructor
@Builder
public class UserSession {
    private final String id; // 멤버 식별자 ID
    private final String sessionId; //멤버 식별자 ID로
    private final String name;
    private final String role;
    private final String profileUrl;
}
