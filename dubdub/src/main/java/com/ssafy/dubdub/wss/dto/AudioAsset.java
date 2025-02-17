package com.ssafy.dubdub.wss.dto;

import lombok.Getter;

@Getter
public class AudioAsset {
    private String id;
    private long tableId;
    private float duration;
    private String url;
}