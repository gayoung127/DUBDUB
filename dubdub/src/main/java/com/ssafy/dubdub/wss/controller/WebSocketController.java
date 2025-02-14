package com.ssafy.dubdub.wss.controller;

import com.ssafy.dubdub.security.dto.CustomUserDetails;
import com.ssafy.dubdub.wss.dto.*;
import com.ssafy.dubdub.wss.repository.UserSessionRepository;
import com.ssafy.dubdub.wss.service.StudioSessionService;
import com.ssafy.dubdub.wss.service.StudioStoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;

@RequiredArgsConstructor
@Controller
public class WebSocketController {
    private final UserSessionRepository userSessionRepository;
    private final StudioStoreService studioStoreService;
    private final StudioSessionService studioSessionService;
    private final SimpMessagingTemplate messagingTemplate;

    // 마우스 데이터 공유
    @MessageMapping("/studio/{sessionId}/cursor")
    public void sendCursorData(@DestinationVariable String sessionId, CursorData cursorData, @Header("simpUser") CustomUserDetails userDetails) {
        String currentUserId = userDetails.getMember().getId().toString();
        broadcastExceptSender(sessionId, "/cursor", cursorData, currentUserId);
    }

    // 재생/녹음 상태 공유
    @MessageMapping("/studio/{sessionId}/playback")
    public void sendPlaybackStatus(@DestinationVariable String sessionId, PlaybackStatus status, @Header("simpUser") CustomUserDetails userDetails) {
        String currentUserId = userDetails.getMember().getId().toString();
        broadcastExceptSender(sessionId, "/playback", status, currentUserId);
    }

    //트랙 점유자(레코더) 공유
    @MessageMapping("/studio/{sessionId}/track/recorder")
    public void broadcastTracks(@DestinationVariable String sessionId, TrackRecorder trackRecorder, @Header("simpUser") CustomUserDetails userDetails) {
        String currentUserId = userDetails.getMember().getId().toString();
        studioStoreService.saveTrackRecorder(sessionId, trackRecorder);
        broadcastExceptSender(sessionId, "/track/recorder", trackRecorder, currentUserId);
    }

    //오디오 파일(에셋) 공유
    @MessageMapping("/studio/{sessionId}/asset")
    public void broadcastAssets(@DestinationVariable String sessionId, AudioAssetRequestDto requestDto, @Header("simpUser") CustomUserDetails userDetails) {
        String currentUserId = userDetails.getMember().getId().toString();
        switch (requestDto.getAction()) {
            case SAVE -> {
                studioStoreService.saveAsset(sessionId, requestDto.getAudioAsset());
            }
            case DELETE -> {
                studioStoreService.deleteAsset(sessionId, requestDto.getAudioAsset().getId());
            }
        }

        broadcastExceptSender(sessionId, "/assets", requestDto, currentUserId);
    }

    //트랙에 올라간 에셋(블록) 저장/공유
    @MessageMapping("/studio/{sessionId}/track/files")
    public void broadcastTracks(@DestinationVariable String sessionId, TrackAssetDto requestDto, @Header("simpUser") CustomUserDetails userDetails) {
        String currentUserId = userDetails.getMember().getId().toString();
        switch (requestDto.getAction()) {
            case SAVE -> {
                studioStoreService.saveTrackFile(sessionId, requestDto.getFile());
            }
            case DELETE -> {
                studioStoreService.deleteTrackFile(sessionId, requestDto.getFile().getId());
            }
        }
        broadcastExceptSender(sessionId, "/track/files", requestDto, currentUserId);
    }

    private void broadcastExceptSender(String sessionId, String destination, Object payload, String senderId) {
        List<UserSession> sessionUsers = userSessionRepository.findBySessionId(sessionId);

        for (UserSession user : sessionUsers) {
            if (!user.getMemberId().equals(senderId)) {
                messagingTemplate.convertAndSendToUser(
                        user.getMemberId(),
                        "/topic/studio/" + sessionId + destination,
                        payload
                );
            }
        }
    }

    // 참여자 목록 조회
    @MessageMapping("/studio/{sessionId}/users")
    @SendTo("/topic/studio/{sessionId}/users")
    public List<UserSession> requestCurrentUsers(@DestinationVariable String sessionId) {
        return studioSessionService.getUsersInSession(sessionId);
    }
}
