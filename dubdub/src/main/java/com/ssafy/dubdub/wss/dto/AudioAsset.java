package com.ssafy.dubdub.wss.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;

//@RedisHash("AudioAsset")
//@AllArgsConstructor
//@NoArgsConstructor
@Getter
public class AudioAsset implements Serializable {
    private String id;
    private long tableId;
    private float duration;
    private String url;
}