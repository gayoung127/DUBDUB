package com.ssafy.dubdub.wss.dto;

import lombok.Builder;
import lombok.Getter;

import java.sql.Timestamp;
import java.util.Map;

@Getter
@Builder
public class WebSocketStatusResponse {
    private int totalConnections;
    private Map<String, StudioSessionStatus> studioSessions;
    private Timestamp timestamp;
}
