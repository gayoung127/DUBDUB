package com.ssafy.dubdub.wss.controller;

import com.ssafy.dubdub.enums.MessageType;
import com.ssafy.dubdub.wss.dto.*;
import com.ssafy.dubdub.wss.service.StudioSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@RequiredArgsConstructor
@Controller
public class WebSocketController {
    private final RabbitTemplate rabbitTemplate;
    private final StudioSessionService studioSessionService;

    // 마우스 데이터 공유
    @MessageMapping("/studio/{sessionId}/cursor")
    public void sendCursorData(@DestinationVariable String sessionId, CursorData cursorData, Principal principal) {
        sendStudioMessage(sessionId, cursorData, MessageType.CURSOR, principal.getName());
    }

    // 재생/녹음 상태 공유
    @MessageMapping("/studio/{sessionId}/playback")
    @SendTo("/topic/studio/{sessionId}/playback")
    public PlaybackStatus sendPlaybackStatus(@DestinationVariable String sessionId, PlaybackStatus status) {
        return status;
    }

    //트랙 점유자(레코더) 공유
    @MessageMapping("/studio/{sessionId}/track/recorder")
    public void broadcastTracks(@DestinationVariable String sessionId, TrackRecorder trackRecorder, Principal principal) {
        sendStudioMessage(sessionId, trackRecorder, MessageType.TRACK_RECORDER, principal.getName());
    }

    //오디오 파일(에셋) 공유
    @MessageMapping("/studio/{sessionId}/asset")
    public void broadcastAssets(@DestinationVariable String sessionId, AudioAssetRequestDto requestDto, Principal principal) {
        sendStudioMessage(sessionId, requestDto, MessageType.ASSET, principal.getName());
    }

    //트랙에 올라간 에셋(블록) 저장/공유
    @MessageMapping("/studio/{sessionId}/track/files")
    public void broadcastTracks(@DestinationVariable String sessionId, TrackAssetDto requestDto, Principal principal) {
        sendStudioMessage(sessionId, requestDto, MessageType.TRACK_FILE, principal.getName());
    }

    private <T> void sendStudioMessage(String sessionId, T payload,
                                       MessageType messageType, String memberId) {

        StudioMessage<T> message = StudioMessage.create(
                sessionId,
                memberId,
                messageType,
                payload
        );
        switch (messageType){
            case TRACK_FILE, TRACK_RECORDER -> rabbitTemplate.convertAndSend("studio.exchange", "studio.track", message);
            case ASSET -> rabbitTemplate.convertAndSend("studio.exchange", "studio.asset", message);
            case CURSOR -> rabbitTemplate.convertAndSend("studio.exchange", "studio.cursor", message);
        }
    }
}
