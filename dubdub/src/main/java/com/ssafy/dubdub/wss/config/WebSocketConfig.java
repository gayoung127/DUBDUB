package com.ssafy.dubdub.wss.config;

import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.security.dto.CustomUserDetails;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.Collections;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String memberId = accessor.getFirstNativeHeader("memberId");

                    if (memberId != null) {
                        // CustomUserDetails를 생성하여 Member 정보 설정
                        Member member = Member.builder()
                                .id(Long.parseLong(memberId))
                                .build();

                        CustomUserDetails userDetails = new CustomUserDetails(member, false);

                        // UsernamePasswordAuthenticationToken 생성 (WebSocketEventListener가 기대하는 형식)
                        Authentication auth = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                Collections.emptyList()
                        );

                        accessor.setUser(auth);
                    }
                }
                return message;
            }
        });
    }

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
