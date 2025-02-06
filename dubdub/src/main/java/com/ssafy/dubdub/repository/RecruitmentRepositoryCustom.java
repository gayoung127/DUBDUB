package com.ssafy.dubdub.repository;

import com.ssafy.dubdub.domain.dto.RecruitmentSearchRequestDTO;
import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.domain.entity.Recruitment;
import org.springframework.data.domain.Page;

public interface RecruitmentRepositoryCustom {
    Page<Recruitment> findBySearchCondition(RecruitmentSearchRequestDTO condition, Member member);
}
