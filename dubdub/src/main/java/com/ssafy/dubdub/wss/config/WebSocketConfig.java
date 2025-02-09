package com.ssafy.dubdub.wss.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-studio").setAllowedOriginPatterns("*");  // 일반 WebSocket 지원
        registry.addEndpoint("/ws-studio").setAllowedOriginPatterns("*").withSockJS();  // SockJS 지원
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");  // 클라이언트가 구독하는 경로
        registry.setApplicationDestinationPrefixes("/app"); // 클라이언트가 메시지 보낼 경로
    }
}
