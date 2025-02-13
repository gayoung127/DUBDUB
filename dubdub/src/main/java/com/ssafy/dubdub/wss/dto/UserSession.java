package com.ssafy.dubdub.wss.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;

@RedisHash(value = "user_session", timeToLive = 86400)
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSession {
    private String id; // 멤버 식별자 ID
    private String sessionId; //멤버 식별자 ID로
    private String name;
    private String role;
    private String profileUrl;
}
