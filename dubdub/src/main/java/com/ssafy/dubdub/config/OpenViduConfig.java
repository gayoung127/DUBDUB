package com.ssafy.dubdub.config;

import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.SessionProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import io.openvidu.java.client.OpenVidu;
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
        return new SessionProperties.Builder().build();
    }

    @Bean
    public ConnectionProperties connectionProperties() {
        return new ConnectionProperties.Builder().build();
    }
}
