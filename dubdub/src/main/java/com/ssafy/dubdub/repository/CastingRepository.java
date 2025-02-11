package com.ssafy.dubdub.repository;

import com.ssafy.dubdub.domain.entity.Casting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CastingRepository extends JpaRepository<Casting, Long>, CastingRepositoryCustom {
    Optional<Casting> findByIdAndRecruitmentId(Long castingId, Long recruitmentId);
}
