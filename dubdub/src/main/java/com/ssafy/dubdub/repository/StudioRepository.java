package com.ssafy.dubdub.repository;

import com.ssafy.dubdub.domain.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudioRepository extends JpaRepository<Session, Long> {

    Optional<Session> findFirstByProjectIdAndIsClosedIsFalse(Long projectId);

    Optional<Session> findBySession(String session);
}
