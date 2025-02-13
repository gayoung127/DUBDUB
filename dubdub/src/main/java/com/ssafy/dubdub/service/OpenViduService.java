package com.ssafy.dubdub.service;

import io.openvidu.java.client.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Transactional
@RequiredArgsConstructor
@Service
public class OpenViduService {

    private final OpenVidu openVidu;
    private final SessionProperties sessionProperties;
    private final ConnectionProperties connectionProperties;

    private final ConcurrentHashMap<String, Session> activeSessions = new ConcurrentHashMap<>();

    public String createSession() throws OpenViduJavaClientException, OpenViduHttpException {

        Session session = openVidu.createSession(sessionProperties);
        activeSessions.put(session.getSessionId(), session);
        return session.getSessionId();
    }

    public String createConnection(String sessionId) throws OpenViduJavaClientException, OpenViduHttpException {
        if (!activeSessions.containsKey(sessionId)) {
            throw new IllegalArgumentException("세션이 존재하지 않습니다.");
        }

        Session session = activeSessions.get(sessionId);
        Connection connection = session.createConnection(connectionProperties);

        return connection.getToken();
    }
}
