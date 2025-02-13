package com.ssafy.dubdub.wss.repository;

import com.ssafy.dubdub.wss.dto.UserSession;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSessionRepository extends CrudRepository<UserSession, String> {
    List<UserSession> findBySessionId(String sessionId);
    UserSession findByUserSessionId(Long userSessionId);
    void deleteByUserSessionId(Long userSessionId);
}
