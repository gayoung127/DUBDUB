package com.ssafy.dubdub.wss.dto;

import com.ssafy.dubdub.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class StudioMessage<T> {
    private String messageId;      // 메시지 고유 식별자
    private String sessionId;      // 스튜디오 세션 ID
    private String senderId;       // 발신자 ID
    private MessageType type;      // 메시지 타입
    private T payload;            // 실제 메시지 내용
    private LocalDateTime timestamp;  // 메시지 생성 시간

    private StudioMessage(String messageId, String sessionId, String senderId,
                          MessageType type, T payload, LocalDateTime timestamp) {
        this.messageId = messageId;
        this.sessionId = sessionId;
        this.senderId = senderId;
        this.type = type;
        this.payload = payload;
        this.timestamp = timestamp;
    }

    public static <T> StudioMessage<T> create(String sessionId, String senderId,
                                              MessageType type, T payload) {
        return new StudioMessage<>(
                UUID.randomUUID().toString(),
                sessionId,
                senderId,
                type,
                payload,
                LocalDateTime.now()
        );
    }
}
