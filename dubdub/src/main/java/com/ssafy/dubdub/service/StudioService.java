package com.ssafy.dubdub.service;

import io.openvidu.java.client.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class StudioService {

    private final OpenVidu openVidu;
    private Map<String, Session> activeSessions = new HashMap<>();

    public String createSession() throws OpenViduJavaClientException, OpenViduHttpException {
        SessionProperties properties = new SessionProperties.Builder().build();
        Session session = openVidu.createSession(properties);
        activeSessions.put(session.getSessionId(), session);
        return session.getSessionId();
    }

    public String createConnection(String sessionId) throws OpenViduJavaClientException, OpenViduHttpException {
        if (!activeSessions.containsKey(sessionId)) {
            throw new IllegalArgumentException("세션이 존재하지 않습니다.");
        }

        Session session = activeSessions.get(sessionId);
        ConnectionProperties properties = new ConnectionProperties.Builder().build();
        Connection connection = session.createConnection(properties);

        return connection.getToken();
    }
}
