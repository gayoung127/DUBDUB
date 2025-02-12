package com.ssafy.dubdub.wss.controller;

import com.ssafy.dubdub.wss.dto.*;
import com.ssafy.dubdub.wss.service.StudioStoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@RequiredArgsConstructor
@Controller
public class WebSocketController {

    private final StudioStoreService studioStoreService;

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

    //트랙 점유자(레코더) 공유
    @MessageMapping("/studio/{sessionId}/track/recorder")
    @SendTo("/studio/{sessionId}/track/recorder")
    public TrackRecorder broadcastTracks(@DestinationVariable String sessionId, TrackRecorder trackRecorder) {
        return trackRecorder;
    }

    //오디오 파일(에셋) 공유
    @MessageMapping("/studio/{sessionId}/asset")
    @SendTo("/studio/{sessionId}/assets")
    public AudioAssetRequestDto broadcastAssets(@DestinationVariable String sessionId, AudioAssetRequestDto requestDto) {
        switch (requestDto.getAction()) {
            case UPDATE -> {
                studioStoreService.saveAsset(sessionId, requestDto.getAudioAsset());
            }
            case REMOVE -> {
                studioStoreService.deleteAsset(sessionId, requestDto.getAudioAsset().getId());
            }
        }

        return requestDto;
    }

    //트랙에 올라간 에셋(블록) 저장/공유
    @MessageMapping("/studio/{sessionId}/track/files")
    @SendTo("/studio/{sessionId}/track/files")
    public TrackAssetDto broadcastTracks(@DestinationVariable String sessionId, TrackAssetDto requestDto) {

        switch (requestDto.getAction()) {
            case UPDATE -> {
                studioStoreService.saveTrackFile(sessionId, requestDto.getFile());
            }
            case REMOVE -> {
                studioStoreService.deleteTrackFile(sessionId, requestDto.getFile().getId());
            }
        }
        return requestDto;
    }
}
