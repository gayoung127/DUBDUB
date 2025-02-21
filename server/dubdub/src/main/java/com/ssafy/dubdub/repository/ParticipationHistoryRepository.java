package com.ssafy.dubdub.repository;

import com.ssafy.dubdub.domain.entity.ParticipationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipationHistoryRepository extends JpaRepository<ParticipationHistory, Long> {

    List<ParticipationHistory> findDistinctByMemberId(Long memberId);
}
