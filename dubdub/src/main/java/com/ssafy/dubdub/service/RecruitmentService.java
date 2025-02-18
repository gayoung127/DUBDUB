package com.ssafy.dubdub.service;

import com.ssafy.dubdub.domain.dto.RecruitmentCreateRequestDTO;
import com.ssafy.dubdub.domain.dto.RecruitmentListResponseDTO;
import com.ssafy.dubdub.domain.dto.RecruitmentSearchRequestDTO;
import com.ssafy.dubdub.domain.entity.Member;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface RecruitmentService {
    Long findRecruitment(Long recruitmentId);

    Long addRecruitment(RecruitmentCreateRequestDTO requestDTO, MultipartFile video, MultipartFile thumbnail, Member author) throws BadRequestException;

    Page<RecruitmentListResponseDTO> getRecruitments(RecruitmentSearchRequestDTO request, Member member);
}
