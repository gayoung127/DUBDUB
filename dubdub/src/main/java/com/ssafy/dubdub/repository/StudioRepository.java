package com.ssafy.dubdub.repository;

import com.ssafy.dubdub.domain.entity.Studio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudioRepository extends JpaRepository<Studio, Long> {
    boolean existsByRecruitmentIdAndIsClosedFalse(Long recruitmentId);
}
