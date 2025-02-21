package com.ssafy.dubdub.wss.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class TrackRecorder {
    private final String trackId;
    private final String recorderId;
}
