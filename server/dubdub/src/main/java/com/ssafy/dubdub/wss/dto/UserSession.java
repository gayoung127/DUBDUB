package com.ssafy.dubdub.wss.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@ToString
@Getter
@Builder
@AllArgsConstructor
@RedisHash(value = "user_session", timeToLive = 86400)
public class UserSession {
    @Id
    private final String memberId; //서버에서 관리하는 사용자 세션\

    @Indexed
    private final String sessionId;

    private final String email; // 멤버 email

    private final String nickName;

    private final String position;

    private final String profileUrl;
}
