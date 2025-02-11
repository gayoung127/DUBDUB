package com.ssafy.dubdub.repository;

import com.ssafy.dubdub.domain.dto.RecruitmentSearchRequestDTO;
import com.ssafy.dubdub.domain.dto.RecruitmentWithVideoDto;
import com.ssafy.dubdub.domain.dto.StudioEnterResponseDto;
import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.domain.entity.Recruitment;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface RecruitmentRepositoryCustom {
    Page<Recruitment> findBySearchCondition(RecruitmentSearchRequestDTO condition, Member member);
    Optional<RecruitmentWithVideoDto> findRecruitmentWithVideo(Long recruitmentId);
}
