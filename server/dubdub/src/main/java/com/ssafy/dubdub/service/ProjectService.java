package com.ssafy.dubdub.service;

import com.ssafy.dubdub.domain.dto.ProjectCreateRequestDTO;
import com.ssafy.dubdub.domain.dto.ProjectListResponseDTO;
import com.ssafy.dubdub.domain.dto.ProjectSearchRequestDTO;
import com.ssafy.dubdub.domain.entity.Member;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface ProjectService {
    Long findRecruitment(Long recruitmentId);

    Long addProject(ProjectCreateRequestDTO requestDTO, MultipartFile video, MultipartFile thumbnail, Member author) throws BadRequestException;

    Page<ProjectListResponseDTO> getProjects(ProjectSearchRequestDTO request, Member member);
}
