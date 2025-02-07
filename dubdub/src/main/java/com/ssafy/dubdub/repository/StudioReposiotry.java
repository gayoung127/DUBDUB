package com.ssafy.dubdub.repository;

import com.ssafy.dubdub.domain.entity.Studio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudioReposiotry extends JpaRepository<Studio, Long> {

    Optional<Studio> findFirstByRecruitmentIdAndIsClosedIsFalse(Long recruitmentId);
}
