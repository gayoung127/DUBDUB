package com.ssafy.dubdub.wss.dto;

import lombok.Builder;
import lombok.Getter;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Builder
public class StudioSessionStatus {
    private String studioSessionId;         // OpenVidu 스튜디오 세션 ID
    private int registeredUsers;            // 등록된 총 사용자 수
    private int activeConnections;          // 실제 활성 연결 수
    private List<ConnectedUser> connectedUsers;
    private Timestamp lastActivityTime;
}
