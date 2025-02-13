package com.ssafy.dubdub.wss.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class PlaybackStatus {
    private final boolean isRecording;
    private final String playState; // "PLAY", "PAUSE", "STOP"
    private final double timelineMarker; // 현재 타임라인 위치 (초)
}