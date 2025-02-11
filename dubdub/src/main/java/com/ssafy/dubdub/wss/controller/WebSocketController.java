package com.ssafy.dubdub.wss.controller;

import com.ssafy.dubdub.util.SecurityUtil;
import com.ssafy.dubdub.wss.dto.AudioAsset;
import com.ssafy.dubdub.wss.dto.CursorData;
import com.ssafy.dubdub.wss.dto.PlaybackStatus;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.sql.Blob;
import java.util.List;

@Controller
public class WebSocketController {

    // 마우스 데이터 공유
    @MessageMapping("/studio/{sessionId}/cursor")
    @SendTo("/topic/studio/{sessionId}/cursor")
    public CursorData sendCursorData(@DestinationVariable String sessionId, CursorData cursorData) {
        return cursorData;
    }

    // 재생/녹음 상태 공유
    @MessageMapping("/studio/{sessionId}/playback")
    @SendTo("/topic/studio/{sessionId}/playback")
    public PlaybackStatus sendPlaybackStatus(@DestinationVariable String sessionId, PlaybackStatus status) {
        return status;
    }

    @MessageMapping("/studio/{sesionId}/assets")
    @SendTo("/studio/{sesionId}/assets")
    public List<AudioAsset> broadcastAssets(@DestinationVariable String sessionId, List<AudioAsset> assets) {
        return assets;
    }
}
