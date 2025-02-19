package com.ssafy.dubdub.config;

import io.openvidu.java.client.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import org.springframework.context.annotation.Bean;

@Configuration
public class OpenViduConfig {

    @Value("${openvidu.url}")
    private String OPENVIDU_URL;

    @Value("${openvidu.secret}")
    private String OPENVIDU_SECRET;

    @Bean
    public OpenVidu openVidu() {
        return new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    @Bean
    public SessionProperties sessionProperties() {
        return new SessionProperties.Builder()
                .mediaMode(MediaMode.ROUTED)  // SFU 방식 유지
                .forcedVideoCodec(VideoCodec.NONE)  // 비디오 코덱 비활성화
                .defaultRecordingProperties(new RecordingProperties.Builder()
                        .hasAudio(true)  // 오디오만 활성화
                        .hasVideo(false) // 비디오 비활성화
                        .build())
                .build();
    }

    @Bean
    public ConnectionProperties connectionProperties() {
        return new ConnectionProperties.Builder()
                .role(OpenViduRole.PUBLISHER)
                .build();
    }
}
