package com.ssafy.dubdub.service;

import io.openvidu.java.client.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Transactional
@RequiredArgsConstructor
@Service
public class OpenViduService {

    private final OpenVidu openVidu;
    private final SessionProperties sessionProperties;
    private final ConnectionProperties connectionProperties;

    public String createSession() throws OpenViduJavaClientException, OpenViduHttpException {

        Session session = openVidu.createSession(sessionProperties);

        return session.getSessionId();
    }

    public String createConnection(String sessionId) throws OpenViduJavaClientException, OpenViduHttpException {

        Session session = openVidu.getActiveSession(sessionId);

        Connection connection = session.createConnection(connectionProperties);

        return connection.getToken();
    }

    public int getCurrentParticipants(String sessionId) {
        Session session = openVidu.getActiveSession(sessionId);

        return session.getActiveConnections().size();
    }

    public void closeSession(String sessionId) throws OpenViduJavaClientException, OpenViduHttpException {
        openVidu.getActiveSession(sessionId).close();
    }
}
