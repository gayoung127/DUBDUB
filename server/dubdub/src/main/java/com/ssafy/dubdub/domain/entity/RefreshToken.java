package com.ssafy.dubdub.domain.entity;

import org.springframework.data.annotation.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@RedisHash(value = "refreshToken", timeToLive = 60 * 60* 24)
public class RefreshToken implements Serializable {
    @Id
    private String email;

    private String refreshToken;
}
