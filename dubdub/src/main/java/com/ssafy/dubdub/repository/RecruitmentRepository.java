package com.ssafy.dubdub.repository;

import com.ssafy.dubdub.domain.entity.Recruitment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecruitmentRepository extends JpaRepository<Recruitment, Long>, RecruitmentRepositoryCustom {

    Optional<Recruitment> findByIdAndAuthorId(Long id, Long authorId);
}
