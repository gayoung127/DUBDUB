package com.ssafy.dubdub.wss.dto;

import lombok.Getter;

@Getter
public class PlaybackStatus {
    private boolean isRecording;
    private String playState; // "PLAY", "PAUSE", "STOP"
    private double timelineMarker; // 현재 타임라인 위치 (초)
}