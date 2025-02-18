package com.ssafy.dubdub.wss.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.dubdub.enums.MessageType;
import com.ssafy.dubdub.wss.dto.*;
import com.ssafy.dubdub.wss.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudioMessageHandler {
    private final StudioStoreService studioStoreService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserSessionRepository userSessionRepository;
    private final ObjectMapper objectMapper;

    // RabbitMQ로부터 메시지를 수신하고 처리
    @RabbitListener(queues = "#{studioEditQueue.name}")
    public void handleStudioMessage(StudioMessage<?> message) {
        try {
            if (message.getType() != MessageType.CURSOR) {
                log.info("Received message: type={}, sessionId={}",
                        message.getType(), message.getSessionId());
            }

            Object payload = message.getPayload();
            StudioMessage<?> convertedMessage = convertMessage(message, payload);

            processMessage(convertedMessage);
            broadcastToOtherClients(convertedMessage);
        } catch (Exception e) {
            log.error("RabbitMQ 메시지 수신과정에서 에러발생: {}", message.getMessageId(), e);
        }
    }

    private StudioMessage<?> convertMessage(StudioMessage<?> originalMessage, Object payload) {
        return switch (originalMessage.getType()) {
            case TRACK_FILE -> StudioMessage.create(
                    originalMessage.getSessionId(),
                    originalMessage.getSenderId(),
                    MessageType.TRACK_FILE,
                    objectMapper.convertValue(payload, TrackAssetDto.class)
            );
            case ASSET -> StudioMessage.create(
                    originalMessage.getSessionId(),
                    originalMessage.getSenderId(),
                    MessageType.ASSET,
                    objectMapper.convertValue(payload, AudioAssetRequestDto.class)
            );
            case TRACK_RECORDER -> StudioMessage.create(
                    originalMessage.getSessionId(),
                    originalMessage.getSenderId(),
                    MessageType.TRACK_RECORDER,
                    objectMapper.convertValue(payload, TrackRecorder.class)
            );
            case PLAYBACK, CURSOR -> originalMessage;
            default -> {
                log.warn("처리하는 메시지의 유형이 아님: {}", originalMessage.getType());
                yield originalMessage;
            }
        };
    }

    private void processMessage(StudioMessage<?> message) {
        switch (message.getType()) {
            case TRACK_FILE -> processTrackFileMessage((StudioMessage<TrackAssetDto>) message);
            case ASSET -> processAssetMessage((StudioMessage<AudioAssetRequestDto>) message);
            case TRACK_RECORDER -> processTrackRecorderMessage((StudioMessage<TrackRecorder>) message);
            case PLAYBACK, CURSOR -> {} // 현재는 처리하지 않음
            default -> log.warn("처리하는 메시지의 유형이 아님: {}", message.getType());
        }
    }

    private void processTrackFileMessage(StudioMessage<TrackAssetDto> message) {
        TrackAssetDto trackAsset = message.getPayload();
        switch (trackAsset.getAction()) {
            case SAVE -> studioStoreService.saveTrackFile(
                    message.getSessionId(),
                    trackAsset.getFile()
            );
            case DELETE -> studioStoreService.deleteTrackFile(
                    message.getSessionId(),
                    trackAsset.getFile().getId()
            );
        }
    }

    private void processAssetMessage(StudioMessage<AudioAssetRequestDto> message) {
        AudioAssetRequestDto requestDto = message.getPayload();
        switch (requestDto.getAction()) {
            case SAVE -> studioStoreService.saveAsset(
                    message.getSessionId(),
                    requestDto.getAudioAsset()
            );
            case DELETE -> studioStoreService.deleteAsset(
                    message.getSessionId(),
                    requestDto.getAudioAsset().getId()
            );
        }
    }

    private void processTrackRecorderMessage(StudioMessage<TrackRecorder> message) {
        studioStoreService.saveTrackRecorder(
                message.getSessionId(),
                message.getPayload()
        );
    }

    private void broadcastToOtherClients(StudioMessage<?> message) {
        List<UserSession> sessionUsers = userSessionRepository
                .findBySessionId(message.getSessionId());

        sessionUsers.stream()
                .filter(user -> !user.getMemberId().equals(message.getSenderId()))
                .forEach(user -> sendMessageToUser(user, message));
    }

    private void sendMessageToUser(UserSession user, StudioMessage<?> message) {
        String destination = String.format("/topic/studio/%s/%s",
                message.getSessionId(),
                getDestinationSuffix(message.getType()));

        messagingTemplate.convertAndSend(
                destination,
                message.getPayload()
        );
    }

    private String getDestinationSuffix(MessageType type) {
        return switch (type) {
            case TRACK_FILE -> "track/files";
            case ASSET -> "assets";
            case TRACK_RECORDER -> "track/recorder";
            case PLAYBACK -> "playback";
            case CURSOR -> "cursor";
        };
    }
}
