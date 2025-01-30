package com.ssafy.dubdub.service;

import com.ssafy.dubdub.domain.dto.RecruitmentCreateRequestDTO;
import org.apache.coyote.BadRequestException;
import org.springframework.web.multipart.MultipartFile;

public interface RecruitmentService {
    public Long findRecruitment(Long recruitmentId);
    public Long addRecruitment(RecruitmentCreateRequestDTO requestDTO, MultipartFile video) throws BadRequestException;
}
