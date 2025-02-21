package com.ssafy.dubdub.wss.dto;

import lombok.Builder;
import lombok.Getter;

import java.sql.Timestamp;

@Getter
@Builder
public class ConnectedUser {
    private String memberId;
    private String nickName;
    private String email;
    private String profileUrl;
    private String position;
    private String webSocketSessionId;      // 실제 WebSocket 세션 ID
    private Timestamp connectionTime;        // 연결 시작 시간
}
