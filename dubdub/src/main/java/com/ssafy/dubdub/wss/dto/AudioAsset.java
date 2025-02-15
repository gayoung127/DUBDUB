package com.ssafy.dubdub.wss.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AudioAsset {
    private String id;
    private long tableId;
    private float duration;
    private String url;
}