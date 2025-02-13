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
    private final String sessionId;
    private final String email; // 멤버 email
    private final String memberId; //서버에서 관리하는 사용자 세션
    private final String nickName;
    private final String position;
    private final String profileUrl;
}
