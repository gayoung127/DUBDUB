package com.ssafy.dubdub.service;

import com.ssafy.dubdub.domain.dto.StudioEnterResponseDto;
import com.ssafy.dubdub.domain.entity.Member;
import com.ssafy.dubdub.domain.entity.Recruitment;
import com.ssafy.dubdub.domain.entity.Studio;
import com.ssafy.dubdub.repository.RecruitmentRepository;
import com.ssafy.dubdub.repository.StudioRepository;
import io.openvidu.java.client.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@Transactional
@RequiredArgsConstructor
public class StudioService {

    private final OpenViduService openViduService;
    private final RecruitmentRepository recruitmentRepository;
    private final StudioRepository studioRepository;

    public StudioEnterResponseDto createStudio(Member member, Long projectId) throws OpenViduJavaClientException, OpenViduHttpException {

        Recruitment project = recruitmentRepository.findById(projectId).orElseThrow(
                () -> new NoSuchElementException("해당 프로젝트가 존재하지 않습니다.")
        );

        Studio studio = studioRepository.findFirstByRecruitmentIdAndIsClosedIsFalse(projectId).orElse(
            new Studio(project, openViduService.createSession())
        );

        String token = openViduService.createConnection(studio.getSession());

        studioRepository.save(studio);

        return StudioEnterResponseDto.builder()
                .title(project.getTitle())
                .script(project.getScript())
                .token(token)
                .session(studio.getSession())
                .snapShot(null)
                .build();
    }
}
